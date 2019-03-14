from rest_framework import serializers

from programs.models import Program, Version
from rest_framework.exceptions import NotAcceptable
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from rest_framework.response import Response


class VersionSerializer(serializers.ModelSerializer):
    program = serializers.CharField(read_only=True)
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Version
        fields = ('id', 'name', 'program')
        extra_kwargs = {
            'name': {
                'validators': []
            }
        }


class ProgramSerializer(serializers.ModelSerializer):
    versions = VersionSerializer(many=True)
    id = serializers.IntegerField(required=False)

    def create(self, validated_data):
        versions_data = validated_data.pop('versions')
        version_instances = []
        instance = Program(name=validated_data['name'])
        instance.save()

        for v in versions_data:
            version = Version(name=v['name'], program=instance)

            try:
                version.save()
            except IntegrityError:
                pass

        # instance = Program.objects.get(id=instance.id)
        return instance

    def update(self, instance, validated_data):
        new_name = validated_data.pop('name')

        if instance.name != new_name:
            try:
                Program.objects.get(name=new_name)
                raise NotAcceptable(detail={
                    'message': 'A program with this name already exist.',
                    'name': new_name
                })
            except ObjectDoesNotExist:
                instance.name = new_name

        versions_data = validated_data.pop('versions')
        version_instances = []
        for v in versions_data:
            try:
                if 'id' in v:
                    version = Version.objects.get(id=v['id'])
                    version.name = v['name']
                    version.save()
                    version_instances.append(version)
                else:
                    version = Version(name=v['name'], program=instance)
                    version.save()
                    version_instances.append(version)
            except IntegrityError:
                raise NotAcceptable(detail={
                    'message': 'A version with this name already exist.',
                    'version': v
                })
            instance.save()
        return instance

    class Meta:
        model = Program
        fields = ('id', 'name', 'versions')
        extra_kwargs = {
            'name': {
                'validators': []
            }
        }
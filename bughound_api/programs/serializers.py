from rest_framework import serializers

from bugs.models import Area
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


class AreaSerializer(serializers.ModelSerializer):
    program = serializers.CharField(read_only=True)
    id = serializers.IntegerField(required=False)

    class Meta:
        model = Area
        fields = ('id', 'name', 'program')


class ProgramSerializer(serializers.ModelSerializer):
    versions = VersionSerializer(many=True)
    id = serializers.IntegerField(required=False)
    areas = AreaSerializer(many=True)

    def create(self, validated_data):
        versions_data = validated_data.pop('versions')
        instance = Program(name=validated_data['name'])
        instance.save()

        for v in versions_data:
            version = Version(name=v['name'], program=instance)

            try:
                version.save()
            except IntegrityError:
                pass

        areas_data = validated_data.pop('areas')
        area_instances = []
        for v in areas_data:
            area = Area(name=v['name'], program=instance)
            area.save()
            try:
                area_instances.append(area)
            except IntegrityError:
                raise NotAcceptable(detail={
                    'message': 'A version with this name already exist.',
                    'version': v
                })
            instance.save()

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

        for v in instance.versions.all():
            if any(v.id == x['id'] for x in versions_data) is False:
                Version.objects.get(id=v.id).delete()

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

        areas_data = validated_data.pop('areas')
        area_instances = []

        for v in instance.areas.all():
            if any(v.id == x['id'] for x in areas_data) is False:
                Area.objects.get(id=v.id).delete()

        for v in areas_data:
            try:
                if 'id' in v:
                    area = Area.objects.get(id=v['id'])
                    area.name = v['name']
                    area.save()
                    area_instances.append(area)
                else:
                    area = Area(name=v['name'], program=instance)
                    area.save()
                    area_instances.append(area)
            except IntegrityError:
                raise NotAcceptable(detail={
                    'message': 'An area with this name already exist.',
                    'version': v
                })

            instance.save()

        return instance

    class Meta:
        model = Program
        fields = ('id', 'name', 'versions', 'areas')
        extra_kwargs = {
            'name': {
                'validators': []
            }
        }
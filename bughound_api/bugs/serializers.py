from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.exceptions import NotFound

from bugs.models import Bug, Area, REPORT_TYPE, SEVERITY
from programs.models import Program, Version
from programs.serializers import ProgramSerializer, VersionSerializer
from users.serializers import UserSerializer


class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'


class BugSerializer(serializers.ModelSerializer):
    program = ProgramSerializer()
    bug_version = VersionSerializer()
    reported_by = UserSerializer(required=False)
    reported_date = serializers.DateField(required=False)
    suggested_fix = serializers.CharField(required=False, allow_blank=True)

    comments = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    function_Area = AreaSerializer(required=False)
    assigned_to = UserSerializer(required=False, allow_null=True)
    resolution_version = VersionSerializer(required=False, allow_null=True)

    def create(self, validated_data):

        program_validated = validated_data.pop('program')
        try:
            program = Program.objects.get(id=program_validated['id'])
        except ObjectDoesNotExist:
            raise NotFound(detail={
                'message': 'Program doesn\'t exist.',
                'program': program_validated
            })

        version_validated = validated_data.pop('bug_version')
        try:
            version = Version.objects.get(id=version_validated['id'], program=program)
        except ObjectDoesNotExist:
            raise NotFound(detail={
                'message': 'Version doesn\'t exist.',
                'version': version_validated
            })

        instance = Bug(program=program, reported_by=self.context['request'].user, bug_version=version, **validated_data)
        instance.save()

        return instance

    def update(self, instance, validated_data):
        program_validated = validated_data.pop('program')
        try:
            program = Program.objects.get(id=program_validated['id'])
            instance.program = program
        except ObjectDoesNotExist:
            raise NotFound(detail={
                'message': 'Program doesn\'t exist.',
                'program': program_validated
            })

        version_validated = validated_data.pop('bug_version')
        try:
            version = Version.objects.get(id=version_validated['id'], program=program)
            instance.version = version
        except ObjectDoesNotExist:
            raise NotFound(detail={
                'message': 'Version doesn\'t exist.',
                'version': version_validated
            })

        validated_data.pop('reported_by')

        # instance.update(**validated_data)
        assigned_to_validated = validated_data.pop('assigned_to', None)
        users = User.objects.all()
        for u in users:
            print(u, u.id)
        if assigned_to_validated is not None:
            try:
                assigned_to_instance = User.objects.get(id=assigned_to_validated['id'])
                instance.assigned_to = assigned_to_instance
            except ObjectDoesNotExist:
                raise NotFound(detail={
                    'message': 'User doesn\'t exist.',
                    'user': assigned_to_validated
                })

        instance.save()

        instance = Bug.objects.update_or_create(id=instance.id, defaults=validated_data)

        return instance

    class Meta:
        model = Bug
        fields = '__all__'

from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.exceptions import NotFound

from bugs.models import Bug, Area, REPORT_TYPE, SEVERITY
from programs.models import Program, Version
from programs.serializers import ProgramSerializer, VersionSerializer, AreaSerializer
from users.serializers import UserSerializer


class BugSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    program = ProgramSerializer()
    bug_version = VersionSerializer()
    reported_by = UserSerializer(required=False)
    reported_date = serializers.DateField(required=False)
    suggested_fix = serializers.CharField(required=False, allow_blank=True)

    comments = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    functional_area = AreaSerializer(required=False, allow_null=True)
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
        validated_data.pop('reported_by')
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
            instance.bug_version = version
        except ObjectDoesNotExist:
            raise NotFound(detail={
                'message': 'Version doesn\'t exist.',
                'version': version_validated
            })


        # instance.update(**validated_data)
        assigned_to_validated = validated_data.pop('assigned_to', None)
        if assigned_to_validated is not None:
            try:
                assigned_to_instance = User.objects.get(id=assigned_to_validated['id'])
                instance.assigned_to = assigned_to_instance
            except ObjectDoesNotExist:
                raise NotFound(detail={
                    'message': 'User doesn\'t exist.',
                    'user': assigned_to_validated
                })

        functional_area_validated = validated_data.pop('functional_area', None)
        if functional_area_validated is not None:
            try:
                instance.functional_area = Area.objects.get(id=functional_area_validated['id'])
            except ObjectDoesNotExist:
                raise NotFound(detail={
                    'message': 'Area doesn\'t exist.',
                    'area': functional_area_validated
                })

        resolution_version_validated = validated_data.pop('resolution_version', None)
        if resolution_version_validated is not None:
            try:
                instance.resolution_version = Version.objects.get(id=resolution_version_validated['id'])
            except ObjectDoesNotExist:
                raise NotFound(detail={
                    'message': 'Version doesn\'t exist.',
                    'version': resolution_version_validated
                })

        instance.save()

        Bug.objects.filter(id=instance.id).update(**validated_data)

        instance.refresh_from_db()
        return instance

    class Meta:
        model = Bug
        fields = '__all__'

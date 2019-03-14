from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.exceptions import NotFound
from rest_framework_jwt.serializers import User

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

        instance = Bug(program=program, bug_version=version,
                       reported_by=self.context['request'].user, **validated_data)
        instance.save()

        return instance

    def update(self, instance, validated_data):
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

        if 'assigned_to' in validated_data:
            assigned_to_validated = validated_data.pop('assigned_to')
            try:
                assigned_to_instance = User.objects.get(id=assigned_to_validated['id'])
            except ObjectDoesNotExist:
                raise NotFound(detail={
                    'message': 'User doesn\'t exist.',
                    'user': assigned_to_validated
                })

        instance = Bug(program=program, assigned_to=assigned_to_instance, bug_version=version,
                       reported_by=self.context['request'].user, **validated_data)
        instance.save()

        return instance

    class Meta:
        model = Bug
        fields = '__all__'

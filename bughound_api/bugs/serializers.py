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

    function_Area = AreaSerializer(required=False)
    assigned_to = UserSerializer(required=False)
    resolution_version = VersionSerializer(required=False)

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

        instance = Bug(program=program, bug_version=version, reported_by=self.context['request'].user,
                        **validated_data)
        instance.save()

        return instance

    class Meta:
        model = Bug
        fields = '__all__'

import django_filters

from programs.models import Version


class VersionFilter(django_filters.FilterSet):

    class Meta:
        model = Version
        fields = ['program__id']

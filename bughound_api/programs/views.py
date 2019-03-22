from collections import OrderedDict

import rules
from django.shortcuts import render
from rest_framework import mixins, generics
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters import rest_framework as filters
from rest_framework.response import Response

from programs.models import Program, Version
from programs.serializers import ProgramSerializer, VersionSerializer
from programs.filters import VersionFilter


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 100


class ProgramDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    permission_classes = (IsAuthenticated|IsAdminUser,)
    serializer_class = ProgramSerializer

    def get_queryset(self):
        return Program.objects.all()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class ProgramListView(mixins.ListModelMixin,
                      mixins.CreateModelMixin,
                      generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = ProgramSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return Program.objects.all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class VersionDetail(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    permission_classes = (IsAuthenticated, IsAdminUser)
    serializer_class = VersionSerializer
    filter_class = VersionFilter
    filter_backends = (filters.DjangoFilterBackend,)

    def get_queryset(self):
        return Version.objects.all()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class VersionListView(mixins.ListModelMixin, mixins.CreateModelMixin,
                      generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = VersionSerializer

    def get_queryset(self):
        return Version.objects.all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


@api_view(['GET'])
def export_results(request):
    query_params = OrderedDict(request.query_params)
    type = query_params.pop('type')

    queryset = Program.objects.filter(**query_params)

    finalStr = ''
    if type.lower() == 'csv':
        finalStr = 'Name,Version,Areas,Open Bugs,Closed Bugs,Resolved Bugs'

        for obj in queryset:
            finalStr += '#'
            versions_str = ';'.join([x.name for x in obj.versions.all()])
            areas_str = ';'.join([x.name for x in obj.areas.all()])
            nb_open = obj.bugs.filter(status=0).count()
            nb_close = obj.bugs.filter(status=1).count()
            nb_resolve = obj.bugs.filter(status=2).count()

            finalStr += '{},{},{},{},{},{}'.format(obj.name, versions_str, areas_str, nb_open, nb_close, nb_resolve)
    elif type.lower() == 'xml':
        for obj in queryset:
            versions_str = '\n'.join(['<version>{}</versions>'.format(x.name) for x in obj.versions.all()])
            areas_str = '\n'.join(['<area>{}</area>'.format(x.name) for x in obj.areas.all()])
            nb_open = obj.bugs.filter(status=0).count()
            nb_close = obj.bugs.filter(status=1).count()
            nb_resolve = obj.bugs.filter(status=2).count()

            finalStr += '<program>\n<name>{}</name>\n<versions>\n{}\n</versions>\n<areas>\n{}\n</areas>\n' \
                        '<openbugs>{}</openbugs>\n<closedbugs>{}</closedbugs>\n<resolvedbugs>{}</resolvedbugs>\n' \
                        '</program>\n'.format(obj.name, versions_str, areas_str, nb_open, nb_close, nb_resolve)
        finalStr = '<programs>\n{}</programs>'.format(finalStr)

    return Response({'result': finalStr})

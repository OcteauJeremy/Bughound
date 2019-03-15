import csv
import datetime
from collections import OrderedDict

from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, generics
from rest_framework.decorators import api_view
from rest_framework.filters import SearchFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters import rest_framework as filters

from bugs.models import Bug, Area
from bugs.serializers import BugSerializer, AreaSerializer
from programs.models import Program
from programs.filters import VersionFilter


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 100


class BugDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    permission_classes = (IsAuthenticated, )
    serializer_class = BugSerializer

    def get_queryset(self):
        return Bug.objects.all()

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class BugListView(mixins.ListModelMixin,
                      mixins.CreateModelMixin,
                      generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = BugSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = (SearchFilter, DjangoFilterBackend)
    search_fields = ('summary', 'description', 'suggested_fix', 'assigned_to__username', 'assigned_to__first_name',
                     'assigned_to__last_name')
    filterset_fields = ('reproducible', 'program__id', 'bug_version__id', 'status', 'severity')

    def get_queryset(self):
        return Bug.objects.all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class AreaListView(mixins.ListModelMixin,
                      generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AreaSerializer

    def get_queryset(self):
        return Area.objects.all()

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


@api_view(['GET'])
def export_results(request):
    query_params = OrderedDict(request.query_params)
    type = query_params.pop('type')

    queryset = Bug.objects.filter(**query_params)

    d = datetime.datetime.today()
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename={0}_{1}.csv'.format('list_bugs', d.strftime('%d-%m-%Y'))
    writer = csv.writer(response)

    writer.writerow(['program', 'program version', 'report type', 'severity', 'summary', 'reproducible', 'description',
                     'suggested_fix', 'reported_by', 'reported_date', 'functionnal_area', 'assigned_to', 'comments'
                     'status', 'priority', 'resolution', 'resolution version'])
    for obj in queryset:

        functionnal_area = ''
        if obj.functional_area is not None:
            functionnal_area = obj.functional_area.name

        assigned_to = ''
        if obj.assigned_to is not None:
            assigned_to = obj.assigned_to.username

        resolution = ''
        if obj.resolution_version is not None:
            resolution = obj.resolution_version.name

        row = [obj.program.name, obj.bug_version.name, obj.get_report_type_display(), obj.get_severity_display(),
               obj.summary, obj.reproducible, obj.description, obj.suggested_fix, obj.reported_by.username, obj.reported_date,
               functionnal_area, assigned_to, obj.comments, obj.get_status_display(), obj.get_priority_display(),
               obj.get_resolution_display(), resolution]
        writer.writerow(row)

    return response
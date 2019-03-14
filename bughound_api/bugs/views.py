from django.shortcuts import render

# Create your views here.

from django.shortcuts import render
from rest_framework import mixins, generics
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
    filter_backends = (SearchFilter,)
    search_fields = ('summary', 'description', 'suggested_fix')

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

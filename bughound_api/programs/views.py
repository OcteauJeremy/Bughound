from django.shortcuts import render
from rest_framework import mixins, generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters import rest_framework as filters

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
    permission_classes = (IsAuthenticated, IsAdminUser)
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

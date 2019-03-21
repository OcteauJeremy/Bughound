from collections import OrderedDict

from django.contrib.auth.models import User, Group
from django.shortcuts import render
from rest_framework import generics, mixins
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from users.permissions import CanModifyPermission
from users.serializers import UserSerializer, GroupSerializer


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 100


class UserView(ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return User.objects.all()


class UserDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    permission_classes = (IsAuthenticated, CanModifyPermission)
    serializer_class = UserSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        if self.request.user.is_staff:
            return User.objects.all()

        return User.objects.all().filter(is_staff=False)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class UserListView(mixins.ListModelMixin,
                  generics.GenericAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        return User.objects.all().filter(is_staff=False)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    # def post(self, request, *args, **kwargs):
    #     return self.create(request, *args, **kwargs)


class GroupView(ModelViewSet):
    permission_classes = (IsAuthenticated,)
    serializer_class = GroupSerializer
    queryset = Group.objects.all()

@api_view(['GET'])
def export_results(request):
    query_params = OrderedDict(request.query_params)
    type = query_params.pop('type')

    queryset = User.objects.all().exclude(is_superuser=True)

    if type.lower() == 'csv':
        finalStr = 'First Name,Last Name,Username,Email,Type'
        for user in queryset:
            finalStr += '#{0},{1},{2},{3},{4}'.format(user.first_name, user.last_name, user.username, user.email,
                                                     user.groups.first().name)

    return Response({'result': finalStr})
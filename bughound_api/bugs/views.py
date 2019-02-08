from django.shortcuts import render

# Create your views here.
from rest_framework import generics

from bugs.models import Employee
from bugs.serializers import EmployeeSerializer


class EmployeeList(generics.ListCreateAPIView, generics.UpdateAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

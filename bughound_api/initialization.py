#!/usr/bin/env python
import os

import django


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bughound_api.settings')
django.setup()

from django.contrib.auth.models import Group
from bugs.models import Area


if __name__ == '__main__':
    Group.objects.all().delete()

    Group.objects.get_or_create(name='Employee')
    Group.objects.get_or_create(name='Developer')

    Area.objects.all().delete()
    Area.objects.get_or_create(name='API')
    Area.objects.get_or_create(name='Front-end')
    Area.objects.get_or_create(name='Compilation')
    Area.objects.get_or_create(name='Deployement')

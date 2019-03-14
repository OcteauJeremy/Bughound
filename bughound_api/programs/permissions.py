import rules
from rest_framework.permissions import BasePermission


@rules.predicate
def is_admin(user):
    return user.is_superuser


@rules.predicate
def is_developper(user):
    return user.groups.filter(name='Developper').exists()


class IsAdminOrDeveloper(BasePermission):

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_staff)
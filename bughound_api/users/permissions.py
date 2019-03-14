from rest_framework import permissions


class CanModifyPermission(permissions.BasePermission):
    """
    Ensure user is in required groups.
    """

    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True

        if request.user.id != int(view.kwargs['pk']):
            return False

        return True

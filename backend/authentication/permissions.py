from rest_framework.permissions import BasePermission



class IsAdmin(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.profile.role == "ADMIN"
        )


class IsManager(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.profile.role in [
                "ADMIN",
                "MANAGER",
            ]
        )


class IsTeller(BasePermission):

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.profile.role in [
                "ADMIN",
                "MANAGER",
                "TELLER",
            ]
        )
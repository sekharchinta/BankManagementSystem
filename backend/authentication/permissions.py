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


class IsStaff(BasePermission):
    """Any non-customer user (superusers are always allowed)."""

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        profile = getattr(request.user, "profile", None)
        return profile is not None and profile.role != "CUSTOMER"
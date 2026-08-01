from django.urls import path

from .views import (
    ProfileView,
    ChangePasswordView,
    UserListView,
    SetPasswordView,
)

urlpatterns = [

    path(
        "profile/",
        ProfileView.as_view(),
    ),

    path(
        "change-password/",
        ChangePasswordView.as_view(),
    ),

    path(
        "users/",
        UserListView.as_view(),
    ),

    path(
        "set-password/",
        SetPasswordView.as_view(),
    ),

]
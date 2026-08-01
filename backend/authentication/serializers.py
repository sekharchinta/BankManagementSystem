from django.contrib.auth.models import User
from rest_framework import serializers


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
        ]


class UserAdminSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "full_name",
            "role",
            "is_staff",
            "is_superuser",
            "is_active",
            "date_joined",
        ]

    def get_full_name(self, obj):
        name = " ".join([obj.first_name, obj.last_name]).strip()
        return name or obj.username

    def get_role(self, obj):
        profile = getattr(obj, "profile", None)
        if profile is not None:
            return profile.role
        if obj.is_superuser:
            return "ADMIN"
        return "STAFF"
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from .permissions import IsStaff
from .serializers import ProfileSerializer, UserAdminSerializer


class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = ProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)


class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        user = request.user

        if not user.check_password(
            request.data["old_password"]
        ):
            return Response(
                {"error": "Old password is incorrect"},
                status=400,
            )

        validate_password(request.data["new_password"])

        user.set_password(
            request.data["new_password"]
        )

        user.save()

        return Response(
            {"message": "Password updated successfully"}
        )


class UserListView(APIView):

    permission_classes = [IsStaff]

    def get(self, request):
        users = User.objects.select_related("profile").order_by("username")
        serializer = UserAdminSerializer(users, many=True)
        return Response(serializer.data)


class SetPasswordView(APIView):

    permission_classes = [IsStaff]

    def post(self, request):
        user_id = request.data.get("user_id")
        new_password = str(request.data.get("new_password", ""))

        if not user_id:
            return Response({"error": "user_id is required"}, status=400)

        user = User.objects.filter(id=user_id).first()
        if not user:
            return Response({"error": "User not found"}, status=404)

        if not new_password:
            return Response({"error": "New password is required"}, status=400)

        try:
            validate_password(new_password, user=user)
        except ValidationError as exc:
            return Response({"error": exc.messages[0]}, status=400)

        user.set_password(new_password)
        user.save()

        return Response({"message": f"Password updated for {user.username}"})
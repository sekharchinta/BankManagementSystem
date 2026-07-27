from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import ProfileSerializer


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

from django.contrib.auth.password_validation import validate_password


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
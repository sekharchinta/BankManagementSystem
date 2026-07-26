from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import DepositSerializer
from .services import deposit


class DepositView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = DepositSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        account = deposit(**serializer.validated_data)

        return Response(
            {
                "message": "Amount deposited successfully",
                "account_number": account.account_number,
                "current_balance": account.balance,
            },
            status=status.HTTP_200_OK,
        )
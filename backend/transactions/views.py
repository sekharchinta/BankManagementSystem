from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import DepositSerializer
from .services import deposit
from .serializers import DepositSerializer, WithdrawSerializer
from .services import deposit, withdraw
from .serializers import TransferSerializer, TransactionSerializer
from .services import transfer
from .models import Transaction
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from authentication.permissions import IsTeller

class TransactionListView(generics.ListAPIView):
    queryset = Transaction.objects.all().order_by("-created_at")
    serializer_class = TransactionSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_fields = ["transaction_type"]

    search_fields = [
        "account__account_number",
        "description",
    ]

    ordering_fields = [
        "created_at",
        "amount",
    ]

class DepositView(APIView):

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

class WithdrawView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = WithdrawSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        account = withdraw(**serializer.validated_data)

        return Response(
            {
                "message": "Withdrawal successful",
                "account_number": account.account_number,
                "current_balance": account.balance
            }
        )

class TransferView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = TransferSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        sender, receiver = transfer(
            **serializer.validated_data
        )

        return Response({
            "message": "Transfer successful",

            "sender": {
                "account_number": sender.account_number,
                "balance": sender.balance
            },

            "receiver": {
                "account_number": receiver.account_number,
                "balance": receiver.balance
            }
        })



class TransactionHistoryView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, account_number):

        queryset = Transaction.objects.filter(
            account__account_number=account_number
        )

        transaction_type = request.GET.get("type")

        if transaction_type:
            queryset = queryset.filter(
                transaction_type=transaction_type
            )

        start = request.GET.get("start")
        end = request.GET.get("end")

        if start and end:
            queryset = queryset.filter(
                created_at__date__range=[start, end]
            )

        serializer = TransactionSerializer(
            queryset,
            many=True
        )

        return Response(serializer.data)

class MiniStatementView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, account_number):

        transactions = Transaction.objects.filter(
            account__account_number=account_number
        )[:10]

        serializer = TransactionSerializer(
            transactions,
            many=True
        )

        return Response(serializer.data)
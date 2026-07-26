from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .services import get_summary, get_recent_transactions
from transactions.serializers import TransactionSerializer


class DashboardSummaryView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        return Response(get_summary())


class RecentTransactionView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        transactions = get_recent_transactions()

        serializer = TransactionSerializer(
            transactions,
            many=True
        )

        return Response(serializer.data)
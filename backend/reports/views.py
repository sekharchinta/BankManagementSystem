from rest_framework.views import APIView
from rest_framework.response import Response

from customers.models import Customer
from accounts.models import Account
from transactions.models import Transaction

from customers.serializers import CustomerSerializer
from accounts.serializers import AccountSerializer
from transactions.serializers import TransactionSerializer


class CustomerReportView(APIView):

    def get(self, request):
        serializer = CustomerSerializer(
            Customer.objects.all(),
            many=True,
        )
        return Response(serializer.data)


class AccountReportView(APIView):

    def get(self, request):
        serializer = AccountSerializer(
            Account.objects.all(),
            many=True,
        )
        return Response(serializer.data)


class TransactionReportView(APIView):

    def get(self, request):
        serializer = TransactionSerializer(
            Transaction.objects.all(),
            many=True,
        )
        return Response(serializer.data)
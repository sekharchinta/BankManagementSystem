from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Account
from .serializers import AccountSerializer
from rest_framework.permissions import AllowAny


class AccountViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]

    queryset = Account.objects.select_related("customer").all()
    serializer_class = AccountSerializer
    lookup_field = "account_number"

    @action(detail=True, methods=["get"])
    def balance(self, request, account_number=None):

        account = self.get_object()

        return Response({
            "account_number": account.account_number,
            "balance": account.balance
        })
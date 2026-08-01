from django.shortcuts import render

# Create your views here.
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import BasePermission, AllowAny

from .models import Account
from .serializers import AccountSerializer, AccountCreateSerializer
from customers.models import Customer
from transactions.services import deposit
from authentication.models import Profile


class IsStaffRole(BasePermission):

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.user.is_superuser:
            return True
        profile = getattr(request.user, "profile", None)
        return profile is not None and profile.role != Profile.CUSTOMER


class AccountViewSet(viewsets.ReadOnlyModelViewSet):

    queryset = Account.objects.select_related("customer").all().order_by("-id")
    serializer_class = AccountSerializer
    lookup_field = "account_number"

    @action(detail=True, methods=["get"])
    def balance(self, request, account_number=None):

        account = self.get_object()

        return Response({
            "account_number": account.account_number,
            "balance": account.balance
        })

    @action(detail=False, methods=["post"], url_path="create", permission_classes=[IsStaffRole])
    def create_account(self, request):

        serializer = AccountCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        customer = Customer.objects.get(id=data["customer_id"])

        account = Account.objects.create(
            customer=customer,
            account_type=data["account_type"],
            status=data["status"],
        )

        if data["initial_balance"] > 0:
            deposit(
                account_number=account.account_number,
                amount=float(data["initial_balance"]),
                description="Opening balance",
            )

        output = AccountSerializer(account)
        return Response(
            {"message": "Account created successfully", "account": output.data},
            status=status.HTTP_201_CREATED
        )

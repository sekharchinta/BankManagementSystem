from rest_framework import serializers
from .models import Account


class AccountSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(
        source="customer.full_name",
        read_only=True
    )

    class Meta:
        model = Account
        fields = [
            "id",
            "account_number",
            "customer_name",
            "account_type",
            "balance",
            "status",
            "created_at",
        ]
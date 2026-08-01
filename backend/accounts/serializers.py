from rest_framework import serializers
from .models import Account
from customers.models import Customer


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


class AccountCreateSerializer(serializers.Serializer):
    customer_id = serializers.IntegerField()
    account_type = serializers.ChoiceField(choices=["Savings", "Current"], default="Savings")
    initial_balance = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        min_value=0,
        default=0,
    )
    status = serializers.ChoiceField(choices=["Active", "Inactive"], default="Active")

    def validate_customer_id(self, value):
        if not Customer.objects.filter(id=value).exists():
            raise serializers.ValidationError("Customer does not exist.")
        return value

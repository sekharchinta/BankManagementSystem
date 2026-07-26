from rest_framework import serializers
from .models import Transaction


class DepositSerializer(serializers.Serializer):
    account_number = serializers.CharField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)


class WithdrawSerializer(serializers.Serializer):
    account_number = serializers.CharField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)


class TransferSerializer(serializers.Serializer):
    from_account = serializers.CharField()
    to_account = serializers.CharField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)


class TransactionSerializer(serializers.ModelSerializer):

    account_number = serializers.CharField(
        source="account.account_number",
        read_only=True
    )

    class Meta:
        model = Transaction
        fields = [
            "id",
            "account_number",
            "transaction_type",
            "amount",
            "balance_after_transaction",
            "reference_account",
            "description",
            "created_at",
        ]
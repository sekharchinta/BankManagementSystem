from rest_framework import serializers


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
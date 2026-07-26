from rest_framework import serializers
from .models import Customer
from accounts.models import Account


class CustomerSerializer(serializers.ModelSerializer):
    account_type = serializers.ChoiceField(
        choices=["Savings", "Current"],
        write_only=True,
        required=False
    )

    account_number = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Customer
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "address",
            "date_of_birth",
            "account_type",
            "account_number",
        ]

    def get_account_number(self, obj):
        account = obj.accounts.first()

        if account:
            return account.account_number

        return None
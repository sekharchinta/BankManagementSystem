from rest_framework import serializers
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    account_type = serializers.ChoiceField(
        choices=["Savings", "Current"],
        write_only=True
    )

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
        ]
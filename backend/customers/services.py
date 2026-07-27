from django.db import transaction

from .models import Customer
from accounts.models import Account


@transaction.atomic
def create_customer(validated_data):

    account_type = validated_data.pop("account_type", "Savings")

    customer = Customer.objects.create(**validated_data)

    account = Account.objects.create(
        customer=customer,
        account_type=account_type,
        balance=0
    )

    return customer
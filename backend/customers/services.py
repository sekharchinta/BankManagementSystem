from django.db import transaction

from .models import Customer
from accounts.models import Account


def create_customer(data):
    with transaction.atomic():

        account_type = data.pop("account_type")

        customer = Customer.objects.create(**data)

        account = Account.objects.create(
            customer=customer,
            account_type=account_type,
            balance=0
        )

        return customer, account
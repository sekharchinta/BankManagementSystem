from django.db import transaction
from django.contrib.auth.models import User
from authentication.models import Profile

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


@transaction.atomic
def register_customer(validated_data, password):
    """Create a customer, an initial account, and a login-capable Django user."""

    account_type = validated_data.pop("account_type", "Savings")

    customer = Customer.objects.create(**validated_data)

    Account.objects.create(
        customer=customer,
        account_type=account_type,
        balance=0
    )

    username = f"customer_{customer.id}"
    name_parts = customer.full_name.split()
    user = User.objects.create_user(
        username=username,
        email=customer.email,
        password=password,
        first_name=name_parts[0] if name_parts else "",
        last_name=" ".join(name_parts[1:]) if len(name_parts) > 1 else "",
    )
    Profile.objects.create(user=user, role=Profile.CUSTOMER)

    return customer, user

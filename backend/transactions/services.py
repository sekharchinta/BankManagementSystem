from decimal import Decimal

from django.db import transaction
from django.shortcuts import get_object_or_404

from accounts.models import Account
from .models import Transaction


@transaction.atomic
def deposit(account_number, amount):

    account = get_object_or_404(
        Account,
        account_number=account_number
    )

    account.balance += Decimal(amount)
    account.save()

    Transaction.objects.create(
        account=account,
        transaction_type="Deposit",
        amount=amount,
        balance_after_transaction=account.balance,
        description="Cash Deposit"
    )

    return account

from accounts.models import Account
from .models import Transaction
from decimal import Decimal
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

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

@transaction.atomic
def withdraw(account_number, amount):

    account = get_object_or_404(
        Account,
        account_number=account_number
    )

    amount = Decimal(amount)

    if amount <= 0:
        raise ValidationError("Amount must be greater than zero.")

    if account.balance < amount:
        raise ValidationError("Insufficient balance.")

    account.balance -= amount
    account.save()

    Transaction.objects.create(
        account=account,
        transaction_type="Withdraw",
        amount=amount,
        balance_after_transaction=account.balance,
        description="Cash Withdrawal"
    )

    return account

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

@transaction.atomic
def transfer(from_account, to_account, amount):

    sender = get_object_or_404(
        Account,
        account_number=from_account
    )

    receiver = get_object_or_404(
        Account,
        account_number=to_account
    )

    amount = Decimal(amount)

    if sender.account_number == receiver.account_number:
        raise ValidationError(
            "Sender and receiver cannot be the same."
        )

    if amount <= 0:
        raise ValidationError(
            "Amount must be greater than zero."
        )

    if sender.balance < amount:
        raise ValidationError(
            "Insufficient balance."
        )

    sender.balance -= amount
    receiver.balance += amount

    sender.save()
    receiver.save()

    Transaction.objects.create(
        account=sender,
        transaction_type="Transfer",
        amount=amount,
        balance_after_transaction=sender.balance,
        reference_account=receiver.account_number,
        description="Money Sent"
    )

    Transaction.objects.create(
        account=receiver,
        transaction_type="Deposit",
        amount=amount,
        balance_after_transaction=receiver.balance,
        reference_account=sender.account_number,
        description="Money Received"
    )

    return sender, receiver
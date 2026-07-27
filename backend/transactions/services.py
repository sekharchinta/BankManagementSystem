from accounts.models import Account
from .models import Transaction
from decimal import Decimal
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError


@transaction.atomic
def deposit(account_number, amount, description="Cash Deposit"):
    account = get_object_or_404(
        Account,
        account_number=account_number
    )

    amount = Decimal(amount)
    if amount <= 0:
        raise ValidationError("Amount must be greater than zero.")

    account.balance += amount
    account.save()

    Transaction.objects.create(
        account=account,
        transaction_type="DEPOSIT",
        amount=amount,
        balance_after_transaction=account.balance,
        description=description or "Cash Deposit"
    )

    return account


@transaction.atomic
def withdraw(account_number, amount, description="Cash Withdrawal"):
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
        transaction_type="WITHDRAW",
        amount=amount,
        balance_after_transaction=account.balance,
        description=description or "Cash Withdrawal"
    )

    return account


@transaction.atomic
def transfer(from_account, to_account, amount, description="Money Transfer"):
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
        raise ValidationError("Sender and receiver cannot be the same.")

    if amount <= 0:
        raise ValidationError("Amount must be greater than zero.")

    if sender.balance < amount:
        raise ValidationError("Insufficient balance.")

    sender.balance -= amount
    receiver.balance += amount

    sender.save()
    receiver.save()

    Transaction.objects.create(
        account=sender,
        transaction_type="TRANSFER",
        amount=amount,
        balance_after_transaction=sender.balance,
        reference_account=receiver.account_number,
        description=f"Transfer to {receiver.account_number}: {description}"
    )

    Transaction.objects.create(
        account=receiver,
        transaction_type="DEPOSIT",
        amount=amount,
        balance_after_transaction=receiver.balance,
        reference_account=sender.account_number,
        description=f"Transfer from {sender.account_number}: {description}"
    )

    return sender, receiver
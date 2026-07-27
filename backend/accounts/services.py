from django.shortcuts import get_object_or_404
from .models import Account


def get_account(account_number):
    return get_object_or_404(
        Account,
        account_number=account_number
    )
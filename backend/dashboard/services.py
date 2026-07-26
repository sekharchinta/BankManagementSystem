from django.db.models import Sum

from customers.models import Customer
from accounts.models import Account
from transactions.models import Transaction


def get_summary():

    total_balance = (
        Account.objects.aggregate(
            total=Sum("balance")
        )["total"] or 0
    )

    return {
        "customers": Customer.objects.count(),
        "accounts": Account.objects.count(),
        "transactions": Transaction.objects.count(),
        "total_balance": total_balance,
    }

def get_recent_transactions():

    return Transaction.objects.select_related(
        "account"
    ).order_by("-created_at")[:10]
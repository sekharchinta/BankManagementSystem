from django.db import models
from accounts.models import Account


class Transaction(models.Model):

    TRANSACTION_TYPES = (
        ("Deposit", "Deposit"),
        ("Withdraw", "Withdraw"),
        ("Transfer", "Transfer"),
    )

    account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name="transactions"
    )

    transaction_type = models.CharField(
        max_length=20,
        choices=TRANSACTION_TYPES
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    balance_after_transaction = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"
from django.db import models


class Transaction(models.Model):

    TRANSACTION_TYPES = [
        ("Deposit", "Deposit"),
        ("Withdraw", "Withdraw"),
        ("Transfer", "Transfer"),
    ]

    account = models.ForeignKey(
        "accounts.Account",
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

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.account.account_number} - {self.transaction_type}"
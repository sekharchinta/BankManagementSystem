from django.db import models
from customers.models import Customer


class Account(models.Model):
    ACCOUNT_TYPES = (
        ("Savings", "Savings"),
        ("Current", "Current"),
    )

    account_number = models.CharField(max_length=20, unique=True)

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE,
        related_name="accounts"
    )

    account_type = models.CharField(
        max_length=20,
        choices=ACCOUNT_TYPES
    )

    balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return self.account_number
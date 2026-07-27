from django.db import models
from customers.models import Customer


class Account(models.Model):

    ACCOUNT_TYPES = [
        ("Savings", "Savings"),
        ("Current", "Current"),
    ]

    STATUS_CHOICES = [
        ("Active", "Active"),
        ("Inactive", "Inactive"),
    ]

    account_number = models.CharField(
        max_length=20,
        unique=True,
        blank=True
    )

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
        default=0.00
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="Active"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.account_number:
            last_account = Account.objects.order_by("-id").first()

            if last_account:
                last_number = int(last_account.account_number[2:])
                self.account_number = f"SB{last_number + 1:09d}"
            else:
                self.account_number = "SB100000001"

        super().save(*args, **kwargs)

    def __str__(self):
        return self.account_number
from django.conf import settings
from django.db import models


class Profile(models.Model):

    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    TELLER = "TELLER"
    CUSTOMER = "CUSTOMER"

    ROLE_CHOICES = [
        (ADMIN, "Admin"),
        (MANAGER, "Manager"),
        (TELLER, "Teller"),
        (CUSTOMER, "Customer"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=TELLER,
    )
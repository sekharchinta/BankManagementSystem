from django.urls import path

from .views import (
    DepositView,
    WithdrawView,
    TransferView,
)

urlpatterns = [
    path("deposit/", DepositView.as_view()),
    path("withdraw/", WithdrawView.as_view()),
    path("transfer/", TransferView.as_view()),
]
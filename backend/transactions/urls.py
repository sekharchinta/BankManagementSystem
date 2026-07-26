from django.urls import path

from .views import (
    DepositView,
    WithdrawView,
    TransferView,
    TransactionHistoryView,
    MiniStatementView,
)

urlpatterns = [
    path("deposit/", DepositView.as_view()),
    path("withdraw/", WithdrawView.as_view()),
    path("transfer/", TransferView.as_view()),

    path(
        "history/<str:account_number>/",
        TransactionHistoryView.as_view()
    ),

    path(
        "mini/<str:account_number>/",
        MiniStatementView.as_view()
    ),
]
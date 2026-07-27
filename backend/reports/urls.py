from django.urls import path
from .views import (
    CustomerReportView,
    AccountReportView,
    TransactionReportView,
)

urlpatterns = [
    path("customers/", CustomerReportView.as_view()),
    path("accounts/", AccountReportView.as_view()),
    path("transactions/", TransactionReportView.as_view()),
]
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    CustomerViewSet,
    CustomerLoginView,
    CustomerRegisterView,
    CustomerMeView,
    CustomerTransferView,
    CustomerDepositView,
    CustomerTransactionsView,
)

router = DefaultRouter()
router.register(r"manage", CustomerViewSet, basename="customers_manage")

urlpatterns = [
    path("login/", CustomerLoginView.as_view(), name="customer_login"),
    path("register/", CustomerRegisterView.as_view(), name="customer_register"),
    path("me/", CustomerMeView.as_view(), name="customer_me"),
    path("transfer/", CustomerTransferView.as_view(), name="customer_transfer"),
    path("deposit/", CustomerDepositView.as_view(), name="customer_deposit"),
    path("transactions/", CustomerTransactionsView.as_view(), name="customer_transactions"),
] + router.urls
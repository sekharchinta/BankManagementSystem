from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/customers/", include("customers.urls")),
    path("api/accounts/", include("accounts.urls")),
    path("api/transactions/", include("transactions.urls")),
]
from django.urls import path

from .views import (
    DashboardSummaryView,
    RecentTransactionView,
)

urlpatterns = [
    path("summary/", DashboardSummaryView.as_view()),
    path(
        "recent-transactions/",
        RecentTransactionView.as_view()
    ),
]
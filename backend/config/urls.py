from django.contrib import admin
from django.conf import settings
from django.db import connection
from django.http import JsonResponse
from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)
from django.urls import path


def health(request):
    return JsonResponse({"status": "ok"})


def db_health(request):
    cfg = settings.DATABASES["default"]
    info = {
        "host": cfg.get("HOST"),
        "port": cfg.get("PORT"),
        "user": cfg.get("USER"),
        "database_name": cfg.get("NAME"),
        "options": cfg.get("OPTIONS"),
    }
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM auth_user")
            cursor.fetchone()
        return JsonResponse({"status": "ok", "database": "connected", **info})
    except Exception as exc:  # noqa: BLE001
        return JsonResponse({"status": "error", "message": str(exc), **info})


urlpatterns = [
    path("admin/", admin.site.urls),

    path("api/health/", health, name="health"),
    path("api/health/db/", db_health, name="db_health"),

    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/",include("authentication.urls"),),

    path("api/customers/", include("customers.urls")),
    path("api/accounts/", include("accounts.urls")),
    path("api/transactions/", include("transactions.urls")),
    path("api/dashboard/", include("dashboard.urls")),
    path("api/reports/", include("reports.urls")),

    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
from rest_framework.views import APIView
from rest_framework.response import Response

from .services import dashboard_data


class DashboardView(APIView):

    def get(self, request):

        return Response(
            dashboard_data()
        )
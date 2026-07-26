from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Customer
from .serializers import CustomerSerializer
from .services import create_customer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by("-id")
    serializer_class = CustomerSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        customer = create_customer(serializer.validated_data)

        response_serializer = CustomerSerializer(customer)

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CustomerSerializer
from .services import create_customer


class CustomerCreateView(APIView):

    def post(self, request):

        serializer = CustomerSerializer(data=request.data)

        if serializer.is_valid():

            customer, account = create_customer(serializer.validated_data)

            return Response(
                {
                    "message": "Customer created successfully",

                    "customer": {
                        "id": customer.id,
                        "full_name": customer.full_name,
                        "email": customer.email,
                    },

                    "account": {
                        "account_number": account.account_number,
                        "account_type": account.account_type,
                        "balance": account.balance,
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
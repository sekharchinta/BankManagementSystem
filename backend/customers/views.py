from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from authentication.models import Profile

from .models import Customer
from accounts.models import Account
from transactions.models import Transaction
from transactions.serializers import TransactionSerializer
from transactions.services import transfer, deposit
from .serializers import CustomerSerializer
from .services import create_customer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by("-id")
    serializer_class = CustomerSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["full_name", "phone", "email"]
    ordering_fields = ["created_at", "full_name"]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        customer = create_customer(serializer.validated_data)
        response_serializer = CustomerSerializer(customer)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )


class CustomerLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        identifier = str(request.data.get("identifier", "")).strip()
        credential = str(request.data.get("credential", "")).strip()

        if not identifier:
            return Response({"error": "Account Number or Email is required"}, status=400)

        # 1. Try finding account by account_number
        account = Account.objects.filter(account_number__iexact=identifier).first()
        customer = None
        if account:
            customer = account.customer
        else:
            # 2. Try finding customer by email
            customer = Customer.objects.filter(email__iexact=identifier).first()
            if customer:
                account = customer.accounts.first()

        if not customer:
            return Response({"error": "No customer found with the provided Account Number or Email"}, status=404)

        # Verification check: If credential provided, match with customer phone or email or allow demo login
        if credential:
            if (credential.lower() != customer.phone.lower() and 
                credential.lower() != customer.email.lower() and 
                credential != "123456" and credential != "demo"):
                return Response({"error": "Invalid Phone Number or Access Credential"}, status=400)

        # Ensure Django User exists for this customer
        username = f"customer_{customer.id}"
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": customer.email,
                "first_name": customer.full_name.split()[0] if customer.full_name else "",
                "last_name": " ".join(customer.full_name.split()[1:]) if customer.full_name and len(customer.full_name.split()) > 1 else "",
            }
        )
        if created or not hasattr(user, "profile"):
            Profile.objects.get_or_create(user=user, defaults={"role": Profile.CUSTOMER})

        refresh = RefreshToken.for_user(user)

        accounts_data = []
        for acc in customer.accounts.all():
            accounts_data.append({
                "account_number": acc.account_number,
                "account_type": acc.account_type,
                "balance": float(acc.balance),
                "status": acc.status,
                "created_at": acc.created_at
            })

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": "CUSTOMER",
            "customer": {
                "id": customer.id,
                "full_name": customer.full_name,
                "email": customer.email,
                "phone": customer.phone,
                "address": customer.address,
                "date_of_birth": customer.date_of_birth,
            },
            "primary_account": accounts_data[0] if accounts_data else None,
            "accounts": accounts_data
        })


class CustomerMeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        account_number = request.query_params.get("account_number")
        customer_id = request.query_params.get("customer_id")

        customer = None
        if account_number:
            acc = Account.objects.filter(account_number=account_number).first()
            if acc:
                customer = acc.customer
        elif customer_id:
            customer = Customer.objects.filter(id=customer_id).first()

        if not customer:
            customer = Customer.objects.first()

        if not customer:
            return Response({"error": "Customer not found"}, status=404)

        accounts_data = []
        for acc in customer.accounts.all():
            accounts_data.append({
                "account_number": acc.account_number,
                "account_type": acc.account_type,
                "balance": float(acc.balance),
                "status": acc.status,
                "created_at": acc.created_at
            })

        return Response({
            "customer": {
                "id": customer.id,
                "full_name": customer.full_name,
                "email": customer.email,
                "phone": customer.phone,
                "address": customer.address,
                "date_of_birth": customer.date_of_birth,
            },
            "primary_account": accounts_data[0] if accounts_data else None,
            "accounts": accounts_data
        })


class CustomerTransferView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        sender_account_number = request.data.get("sender_account_number")
        receiver_account_number = request.data.get("receiver_account_number")
        amount = request.data.get("amount")
        description = request.data.get("description", "Customer Online Transfer")

        if not sender_account_number or not receiver_account_number or not amount:
            return Response({"error": "Sender account, receiver account, and amount are required."}, status=400)

        try:
            amount_val = float(amount)
            if amount_val <= 0:
                return Response({"error": "Amount must be greater than zero."}, status=400)

            sender, receiver = transfer(
                from_account=sender_account_number,
                to_account=receiver_account_number,
                amount=amount_val,
                description=description
            )

            latest_tx = Transaction.objects.filter(account=sender).order_by("-id").first()
            tx_data = TransactionSerializer(latest_tx).data if latest_tx else None

            return Response({
                "message": "Money transfer completed successfully",
                "sender": {
                    "account_number": sender.account_number,
                    "balance": float(sender.balance)
                },
                "receiver": {
                    "account_number": receiver.account_number,
                    "customer_name": receiver.customer.full_name
                },
                "transaction": tx_data
            }, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class CustomerDepositView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        account_number = request.data.get("account_number")
        amount = request.data.get("amount")
        description = request.data.get("description", "Customer Online Deposit")

        if not account_number or not amount:
            return Response({"error": "Account number and amount are required."}, status=400)

        try:
            amount_val = float(amount)
            if amount_val <= 0:
                return Response({"error": "Amount must be greater than zero."}, status=400)

            account = deposit(
                account_number=account_number,
                amount=amount_val,
                description=description
            )

            latest_tx = Transaction.objects.filter(account=account).order_by("-id").first()
            tx_data = TransactionSerializer(latest_tx).data if latest_tx else None

            return Response({
                "message": "Deposit added successfully",
                "account_number": account.account_number,
                "current_balance": float(account.balance),
                "transaction": tx_data
            }, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class CustomerTransactionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        account_number = request.query_params.get("account_number")
        if not account_number:
            first_acc = Account.objects.first()
            account_number = first_acc.account_number if first_acc else None

        if not account_number:
            return Response([], status=200)

        txs = Transaction.objects.filter(account__account_number=account_number).order_by("-created_at")
        serializer = TransactionSerializer(txs, many=True)
        return Response(serializer.data)

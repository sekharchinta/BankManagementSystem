from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from authentication.models import Profile
from customers.models import Customer
from customers.services import register_customer
from transactions.services import deposit, transfer, withdraw


def backdate(obj, days):
    obj.created_at = timezone.now() - timedelta(days=days)
    obj.save(update_fields=["created_at"])


STAFF = [
    {"username": "admin", "password": "Admin@123", "role": Profile.ADMIN, "superuser": True, "name": "System Administrator"},
    {"username": "manager", "password": "Manager@123", "role": Profile.MANAGER, "superuser": False, "name": "Meera Krishnan"},
    {"username": "teller", "password": "Teller@123", "role": Profile.TELLER, "superuser": False, "name": "Arjun Nair"},
]

CUSTOMERS = [
    {"full_name": "Rahul Sharma", "email": "rahul.sharma@example.com", "phone": "9812345670",
     "address": "42 MG Road, Bengaluru, Karnataka", "date_of_birth": "1991-04-12",
     "account_type": "Savings", "opening": 25000.0, "days": 28},
    {"full_name": "Priya Verma", "email": "priya.verma@example.com", "phone": "9821345671",
     "address": "18 Lake View Road, Chennai, Tamil Nadu", "date_of_birth": "1988-09-23",
     "account_type": "Current", "opening": 150000.0, "days": 27},
    {"full_name": "Amit Patel", "email": "amit.patel@example.com", "phone": "9832456712",
     "address": "7 Ring Road, Ahmedabad, Gujarat", "date_of_birth": "1994-01-05",
     "account_type": "Savings", "opening": 85000.0, "days": 26},
    {"full_name": "Sneha Reddy", "email": "sneha.reddy@example.com", "phone": "9843567123",
     "address": "55 Jubilee Hills, Hyderabad, Telangana", "date_of_birth": "1996-11-30",
     "account_type": "Savings", "opening": 12500.0, "days": 25},
    {"full_name": "Vikram Singh", "email": "vikram.singh@example.com", "phone": "9854671234",
     "address": "23 Connaught Place, New Delhi", "date_of_birth": "1985-06-17",
     "account_type": "Current", "opening": 320000.0, "days": 24},
    {"full_name": "Ananya Iyer", "email": "ananya.iyer@example.com", "phone": "9865712345",
     "address": "9 T Nagar, Chennai, Tamil Nadu", "date_of_birth": "1998-02-08",
     "account_type": "Savings", "opening": 47800.0, "days": 23},
    {"full_name": "Rohan Mehta", "email": "rohan.mehta@example.com", "phone": "9876123456",
     "address": "31 Linking Road, Mumbai, Maharashtra", "date_of_birth": "1992-08-25",
     "account_type": "Savings", "opening": 5000.0, "days": 22},
    {"full_name": "Kavya Nair", "email": "kavya.nair@example.com", "phone": "9887234561",
     "address": "12 Marine Drive, Kochi, Kerala", "date_of_birth": "1990-12-02",
     "account_type": "Current", "opening": 210000.0, "days": 20},
]


class Command(BaseCommand):
    help = "Seed the database with staff users, demo customers, accounts, and a realistic transaction history."

    def handle(self, *args, **options):
        from django.contrib.auth.models import User
        from accounts.models import Account
        from transactions.models import Transaction

        customer_password = "Customer@123"

        for s in STAFF:
            user, _ = User.objects.get_or_create(username=s["username"])
            user.set_password(s["password"])
            user.is_staff = True
            user.is_superuser = s["superuser"]
            first, _, last = s["name"].partition(" ")
            user.first_name = first
            user.last_name = last
            user.save()
            profile, _ = Profile.objects.get_or_create(user=user, defaults={"role": s["role"]})
            profile.role = s["role"]
            profile.save()
            self.stdout.write(self.style.SUCCESS(f"staff ready: {user.username} / {s['password']} ({s['role']})"))

        customers = {}

        if Customer.objects.count() > 0:
            self.stdout.write(self.style.WARNING(
                "Customers already exist - seed_demo is designed for a fresh/test database. "
                "Skipping customer and transaction seeding."
            ))
            return

        for c in CUSTOMERS:
            payload = {k: c[k] for k in ("full_name", "email", "phone", "address", "date_of_birth", "account_type")}
            customer, user = register_customer(payload, customer_password)
            customers[c["email"]] = customer
            acc = customer.accounts.first()
            deposit(account_number=acc.account_number, amount=c["opening"], description=f"Opening balance for {c['account_type']} account")
            backdate(acc, c["days"])
            backdate(acc.transactions.first(), c["days"])
            self.stdout.write(self.style.SUCCESS(f"customer ready: {c['full_name']} | {acc.account_number} | {c['email']} / {customer_password}"))

        def acc(email):
            return customers[email].accounts.first().account_number

        def tx(account_number, transaction_type, amount, description, days):
            if transaction_type == "deposit":
                deposit(account_number=account_number, amount=amount, description=description)
            elif transaction_type == "withdraw":
                withdraw(account_number=account_number, amount=amount, description=description)
            t = Transaction.objects.filter(account=Account.objects.get(account_number=account_number)).order_by("-id").first()
            backdate(t, days)

        def move(from_acc, to_acc, amount, description, days):
            sender, receiver = transfer(from_account=from_acc, to_account=to_acc, amount=amount, description=description)
            st = Transaction.objects.filter(account=sender).order_by("-id").first()
            rt = Transaction.objects.filter(account=receiver).order_by("-id").first()
            backdate(st, days)
            backdate(rt, days)

        r1 = acc("rahul.sharma@example.com")
        p2 = acc("priya.verma@example.com")
        a3 = acc("amit.patel@example.com")
        s4 = acc("sneha.reddy@example.com")
        v5 = acc("vikram.singh@example.com")
        a6 = acc("ananya.iyer@example.com")
        r7 = acc("rohan.mehta@example.com")
        k8 = acc("kavya.nair@example.com")

        tx(r1, "deposit", 10000.0, "Salary credit - Infosys", 21)
        tx(r1, "withdraw", 3000.0, "ATM withdrawal", 12)
        move(r1, p2, 5000.0, "Rent payment", 5)
        tx(p2, "deposit", 50000.0, "Business income", 18)
        tx(p2, "withdraw", 20000.0, "Vendor payment", 2)
        tx(a3, "withdraw", 15000.0, "Education fees", 15)
        tx(a3, "deposit", 12000.0, "Freelance income", 8)
        tx(s4, "withdraw", 2500.0, "Grocery shopping", 10)
        tx(v5, "deposit", 75000.0, "Contract payment", 14)
        move(v5, k8, 30000.0, "Invoice settlement", 6)
        tx(a6, "withdraw", 5000.0, "Online shopping", 9)
        tx(a6, "deposit", 8000.0, "Refund received", 3)
        tx(r7, "withdraw", 1000.0, "Mobile recharge", 4)
        tx(r7, "deposit", 2500.0, "Cash deposit", 1)
        tx(k8, "withdraw", 10000.0, "Operational expenses", 7)

        self.stdout.write(self.style.SUCCESS(f"SEED COMPLETE - customers: {Customer.objects.count()}, "
                                             f"accounts: {Account.objects.count()}, "
                                             f"transactions: {Transaction.objects.count()}, "
                                             f"users: {User.objects.count()}"))

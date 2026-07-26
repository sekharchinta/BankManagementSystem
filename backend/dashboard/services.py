from customers.models import Customer
from accounts.models import Account
from transactions.models import Transaction


def dashboard_data():

    return {

        "customers":
            Customer.objects.count(),

        "accounts":
            Account.objects.count(),

        "transactions":
            Transaction.objects.count(),

        "total_balance":
            sum(
                account.balance
                for account in Account.objects.all()
            )

    }
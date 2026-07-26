export default function RecentTransactions({ transactions }) {

    return (
        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
                Recent Transactions
            </h2>

            <table className="w-full">

                <thead>

                    <tr className="border-b">

                        <th className="text-left py-2">
                            Account
                        </th>

                        <th className="text-left">
                            Type
                        </th>

                        <th className="text-left">
                            Amount
                        </th>

                        <th className="text-left">
                            Date
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {transactions.map((transaction) => (

                        <tr
                            key={transaction.id}
                            className="border-b"
                        >

                            <td className="py-3">
                                {transaction.account_number}
                            </td>

                            <td>
                                {transaction.transaction_type}
                            </td>

                            <td>
                                £{transaction.amount}
                            </td>

                            <td>
                                {new Date(
                                    transaction.created_at
                                ).toLocaleDateString()}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );

}
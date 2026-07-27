export default function CustomerTable({
    customers,
    onDelete,
}) {

    return (

        <table className="w-full bg-white rounded-lg shadow">

            <thead>

                <tr className="bg-slate-100">

                    <th className="p-3">ID</th>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

                {customers.map((customer) => (

                    <tr
                        key={customer.customer_id}
                        className="border-t"
                    >

                        <td className="p-3">
                            {customer.customer_id}
                        </td>

                        <td>{customer.fullname}</td>

                        <td>{customer.username}</td>

                        <td>{customer.email}</td>

                        <td>{customer.phnno}</td>

                        <td>

                            <button
                                onClick={() =>
                                    onDelete(customer.customer_id)
                                }
                                className="bg-red-600 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    );

}
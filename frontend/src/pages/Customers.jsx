import { useEffect, useState } from "react";

import CustomerForm from "../components/customers/CustomerForm";
import CustomerTable from "../components/customers/CustomerTable";
import LoadingSpinner from "../components/ui/LoadingSpinner";

import {
    getCustomers,
    createCustomer,
    deleteCustomer,
} from "../services/customerService";

import toast from "react-hot-toast";

export default function Customers() {

    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const data = await getCustomers();

            // Handle paginated or non-paginated responses
            setCustomers(data.results || data);
        } catch (error) {
            toast.error("Failed to load customers");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const addCustomer = async (customer) => {
        try {
            await createCustomer(customer);
            toast.success("Customer added successfully");
            setShowForm(false);
            loadCustomers();
        } catch (error) {
            toast.error("Failed to add customer");
            console.error(error);
        }
    };

    const removeCustomer = async (id) => {

        if (!window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) return;

        try {
            await deleteCustomer(id);
            toast.success("Customer deleted successfully");
            loadCustomers();
        } catch (error) {
            toast.error("Failed to delete customer");
            console.error(error);
        }

    };

    return (

        <div>

            <div className="flex items-center justify-between mb-6">

                <div>

                    <h1 className="text-2xl font-bold text-slate-800 mb-1">
                        Customer Management
                    </h1>

                    <p className="text-sm text-slate-500">
                        Manage and view all customer records
                    </p>

                </div>

                <button

                    onClick={() => setShowForm(!showForm)}

                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"

                >

                    {showForm ? 'Hide Form' : '+ Add Customer'}

                </button>

            </div>

            {showForm && (

                <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-100 p-6">

                    <h2 className="text-lg font-semibold text-slate-800 mb-4">

                        Add New Customer

                    </h2>

                    <CustomerForm onSubmit={addCustomer} />

                </div>

            )}

            {loading ? (

                <LoadingSpinner text="Loading customers..." />

            ) : (

                <CustomerTable

                    customers={customers}

                    onDelete={removeCustomer}

                />

            )}

        </div>

    );

}
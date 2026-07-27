import { useEffect, useState } from "react";
import { Landmark, TrendingUp } from "lucide-react";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import toast from "react-hot-toast";

import {
    getAccounts,
    getAccountBalance,
} from "../services/accountService";

import AccountTable from "../components/accounts/AccountTable";

export default function Accounts() {

    const [accounts, setAccounts] = useState([]);

    const [selectedBalance, setSelectedBalance] = useState(null);

    const [loading, setLoading] = useState(true);

    const [balanceLoading, setBalanceLoading] = useState(false);

    useEffect(() => {

        loadAccounts();

    }, []);

    const loadAccounts = async () => {

        try {

            setLoading(true);

            const data = await getAccounts();

            setAccounts(data.results || data);

        } catch (error) {

            toast.error("Failed to load accounts");

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const viewBalance = async (accountNumber) => {

        try {

            setBalanceLoading(true);

            const data = await getAccountBalance(accountNumber);

            setSelectedBalance({

                accountNumber,

                balance: data.balance,

            });

            toast.success("Balance loaded");

        } catch (error) {

            toast.error("Failed to load balance");

            console.error(error);

        } finally {

            setBalanceLoading(false);

        }

    };

    if (loading) {

        return <LoadingSpinner text="Loading accounts..." />;

    }

    return (

        <div>

            <div className="flex items-center justify-between mb-6">

                <div>

                    <h1 className="text-2xl font-bold text-slate-800 mb-1">
                        Bank Accounts
                    </h1>

                    <p className="text-sm text-slate-500">
                        Manage and view all customer accounts
                    </p>

                </div>

                <button

                    onClick={loadAccounts}

                    className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition flex items-center gap-2"

                >

                    <Landmark size={16} />
                    Refresh

                </button>

            </div>

            {selectedBalance !== null && (

                <div className="mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-emerald-700 font-medium mb-2">Account</p>

                            <h2 className="text-xl font-bold text-emerald-900 mb-3">

                                {selectedBalance.accountNumber}

                            </h2>

                            <p className="text-2xl font-bold text-emerald-600">

                                ₹{selectedBalance.balance?.toLocaleString("en-IN") || "0"}

                            </p>

                        </div>

                        <div className="flex-shrink-0">

                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">

                                <TrendingUp size={32} className="text-emerald-600" />

                            </div>

                        </div>

                    </div>

                    <button

                        onClick={() => setSelectedBalance(null)}

                        className="mt-4 text-sm text-emerald-700 hover:text-emerald-900 font-medium transition"

                    >

                        ✕ Dismiss

                    </button>

                </div>

            )}

            {balanceLoading && (

                <div className="mb-6 text-center text-slate-500">

                    Loading balance...

                </div>

            )}

            <AccountTable

                accounts={accounts}

                onViewBalance={viewBalance}

            />

        </div>

    );

}
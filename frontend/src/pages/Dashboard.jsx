import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";
import SummaryCard from "../components/dashboard/SummaryCard";
import RecentTransactions from "../components/dashboard/RecentTransactions";

import {
    getDashboardSummary,
    getRecentTransactions,
} from "../services/dashboardService";

export default function Dashboard() {

    const [summary, setSummary] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function fetchDashboard() {

            try {

                const summaryData =
                    await getDashboardSummary();

                const recentData =
                    await getRecentTransactions();

                setSummary(summaryData);
                setTransactions(recentData);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        }

        fetchDashboard();

    }, []);

     if (loading) {
                    return (
                        <Layout>
                            <Loader />
                        </Layout>
                    );
                }

    return (

        <Layout>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">

                <SummaryCard
                    title="Customers"
                    value={summary.customers}
                    color="bg-blue-600"
                />

                <SummaryCard
                    title="Accounts"
                    value={summary.accounts}
                    color="bg-green-600"
                />

                <SummaryCard
                    title="Transactions"
                    value={summary.transactions}
                    color="bg-purple-600"
                />

                <SummaryCard
                    title="Total Balance"
                    value={`£${summary.total_balance}`}
                    color="bg-orange-500"
                />

            </div>

            <RecentTransactions
                transactions={transactions}
            />

        </Layout>

    );

}
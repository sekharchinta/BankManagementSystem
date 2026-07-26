import Layout from "../components/layout/Layout";
import SummaryCard from "../components/dashboard/SummaryCard";

export default function Dashboard() {

    return (

        <Layout>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <SummaryCard
                    title="Customers"
                    value="125"
                    color="bg-blue-600"
                />

                <SummaryCard
                    title="Accounts"
                    value="125"
                    color="bg-green-600"
                />

                <SummaryCard
                    title="Transactions"
                    value="542"
                    color="bg-purple-600"
                />

                <SummaryCard
                    title="Total Balance"
                    value="£245,750"
                    color="bg-orange-500"
                />

            </div>

        </Layout>

    );

}
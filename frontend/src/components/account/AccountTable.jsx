import { useEffect, useState } from "react";

import Layout from "../components/layout/Layout";
import AccountTable from "../components/account/AccountTable";

import { getAccounts } from "../services/accounts";

export default function Accounts() {

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadAccounts();

    }, []);

    async function loadAccounts() {

        try {

            const data = await getAccounts();

            setAccounts(data.results);

        } finally {

            setLoading(false);

        }

    }

    return (

        <Layout>

            <AccountTable
                accounts={accounts}
                loading={loading}
            />

        </Layout>

    );

}
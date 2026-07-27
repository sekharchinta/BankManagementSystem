import TransactionForm from "../components/transactions/TransactionForm";
import { deposit } from "../services/transactionService";

export default function Deposit() {
  const submit = async (data) => {
    const res = await deposit(data);
    return res;
  };

  return (
    <TransactionForm
      title="Staff Cash Deposit"
      buttonText="Process Deposit"
      type="DEPOSIT"
      onSubmit={submit}
    />
  );
}
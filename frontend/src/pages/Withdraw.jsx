import TransactionForm from "../components/transactions/TransactionForm";
import { withdraw } from "../services/transactionService";

export default function Withdraw() {
  const submit = async (data) => {
    const res = await withdraw(data);
    return res;
  };

  return (
    <TransactionForm
      title="Staff Cash Withdrawal"
      buttonText="Process Withdrawal"
      type="WITHDRAW"
      onSubmit={submit}
    />
  );
}
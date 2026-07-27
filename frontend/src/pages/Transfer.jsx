import TransactionForm from "../components/transactions/TransactionForm";
import { transfer } from "../services/transactionService";

export default function Transfer() {
  const submit = async (data) => {
    const res = await transfer({
      sender_account_number: data.account_number,
      receiver_account_number: data.receiver_account_number,
      amount: data.amount,
      description: data.description,
    });
    return res;
  };

  return (
    <TransactionForm
      title="Staff Money Transfer"
      buttonText="Execute Transfer"
      type="TRANSFER"
      onSubmit={submit}
    />
  );
}
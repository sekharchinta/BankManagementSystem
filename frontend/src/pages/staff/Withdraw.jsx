import PageHeader from "../../components/ui/PageHeader";
import MoneyForm from "../../components/shared/MoneyForm";

export default function Withdraw() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Withdrawal"
        subtitle="Debit funds from a customer's account"
      />
      <MoneyForm mode="withdraw" />
    </div>
  );
}

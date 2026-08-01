import PageHeader from "../../components/ui/PageHeader";
import MoneyForm from "../../components/shared/MoneyForm";

export default function Deposit() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Deposit"
        subtitle="Credit funds into a customer's account"
      />
      <MoneyForm mode="deposit" />
    </div>
  );
}

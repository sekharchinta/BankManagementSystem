import PageHeader from "../../components/ui/PageHeader";
import MoneyForm from "../../components/shared/MoneyForm";

export default function Transfer() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Transfer"
        subtitle="Move money between two accounts"
      />
      <MoneyForm mode="transfer" />
    </div>
  );
}

import { api } from "../lib/api";

export function reportCustomers() {
  return api.get("reports/customers/").then((res) => res.data);
}

export function reportAccounts() {
  return api.get("reports/accounts/").then((res) => res.data);
}

export function reportTransactions() {
  return api.get("reports/transactions/").then((res) => res.data);
}

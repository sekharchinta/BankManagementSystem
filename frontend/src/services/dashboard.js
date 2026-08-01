import { api } from "../lib/api";

export function getSummary() {
  return api.get("dashboard/summary/").then((res) => res.data);
}

export function getRecentTransactions() {
  return api.get("dashboard/recent-transactions/").then((res) => res.data);
}

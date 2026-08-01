import { api } from "../lib/api";

// ---- Staff: customer management ----
export function listCustomers(params) {
  return api.get("customers/manage/", { params }).then((res) => res.data);
}

export function getCustomer(id) {
  return api.get(`customers/manage/${id}/`).then((res) => res.data);
}

export function createCustomer(payload) {
  return api.post("customers/manage/", payload).then((res) => res.data);
}

export function updateCustomer(id, payload) {
  return api.patch(`customers/manage/${id}/`, payload).then((res) => res.data);
}

export function deleteCustomer(id) {
  return api.delete(`customers/manage/${id}/`).then((res) => res.data);
}

// ---- Customer portal ----
export function customerLogin(payload) {
  return api.post("customers/login/", payload).then((res) => res.data);
}

export function customerRegister(payload) {
  return api.post("customers/register/", payload).then((res) => res.data);
}

export function customerMe(accountNumber) {
  const params = accountNumber ? { account_number: accountNumber } : {};
  return api.get("customers/me/", { params }).then((res) => res.data);
}

export function customerDeposit(payload) {
  return api.post("customers/deposit/", payload).then((res) => res.data);
}

export function customerTransfer(payload) {
  return api.post("customers/transfer/", payload).then((res) => res.data);
}

export function customerTransactions(accountNumber) {
  const params = accountNumber ? { account_number: accountNumber } : {};
  return api.get("customers/transactions/", { params }).then((res) => res.data);
}

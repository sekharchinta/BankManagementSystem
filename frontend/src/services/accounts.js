import { api } from "../lib/api";

export function listAccounts(params) {
  return api.get("accounts/", { params }).then((res) => res.data);
}

export function getAccount(accountNumber) {
  return api.get(`accounts/${accountNumber}/`).then((res) => res.data);
}

export function getAccountBalance(accountNumber) {
  return api.get(`accounts/${accountNumber}/balance/`).then((res) => res.data);
}

export function createAccount(payload) {
  return api.post("accounts/create/", payload).then((res) => res.data);
}

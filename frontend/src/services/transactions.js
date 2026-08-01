import { api } from "../lib/api";

export function listTransactions(params) {
  return api.get("transactions/", { params }).then((res) => res.data);
}

export function deposit(payload) {
  return api.post("transactions/deposit/", payload).then((res) => res.data);
}

export function withdraw(payload) {
  return api.post("transactions/withdraw/", payload).then((res) => res.data);
}

export function transfer(payload) {
  return api.post("transactions/transfer/", payload).then((res) => res.data);
}

export function getHistory(accountNumber, params) {
  return api
    .get(`transactions/history/${accountNumber}/`, { params })
    .then((res) => res.data);
}

export function getMiniStatement(accountNumber) {
  return api.get(`transactions/mini/${accountNumber}/`).then((res) => res.data);
}

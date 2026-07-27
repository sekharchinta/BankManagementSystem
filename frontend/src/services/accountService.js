import api from "./api";

export const getAccounts = async () => {
    const response = await api.get("accounts/");
    return response.data;
};

export const getAccountDetails = async (accountNumber) => {
    const response = await api.get(`accounts/${accountNumber}/`);
    return response.data;
};

export const getAccountBalance = async (accountNumber) => {
    const response = await api.get(
        `accounts/${accountNumber}/balance/`
    );
    return response.data;
};
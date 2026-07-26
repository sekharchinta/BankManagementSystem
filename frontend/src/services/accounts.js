import api from "./api";

export const getAccounts = async (
    search = "",
    page = 1,
    type = "",
    status = ""
) => {

    const response = await api.get(
        `accounts/?search=${search}&page=${page}&account_type=${type}&status=${status}`
    );

    return response.data;
};

export const getAccount = async (accountNumber) => {

    const response = await api.get(
        `accounts/${accountNumber}/`
    );

    return response.data;
};

export const getBalance = async (accountNumber) => {

    const response = await api.get(
        `accounts/${accountNumber}/balance/`
    );

    return response.data;
};
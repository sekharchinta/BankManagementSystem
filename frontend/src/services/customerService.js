import api from "./api";

// Staff customer management
export const getCustomers = async () => {
    const response = await api.get("customers/manage/");
    return response.data;
};

export const createCustomer = async (customer) => {
    const response = await api.post("customers/manage/", customer);
    return response.data;
};

export const updateCustomer = async (id, customer) => {
    const response = await api.put(`customers/manage/${id}/`, customer);
    return response.data;
};

export const deleteCustomer = async (id) => {
    await api.delete(`customers/manage/${id}/`);
};

// Customer Portal Services
export const loginCustomerApi = async (credentials) => {
    const response = await api.post("customers/login/", credentials);
    return response.data;
};

export const fetchCustomerMeApi = async (accountNumber) => {
    const response = await api.get(`customers/me/${accountNumber ? `?account_number=${accountNumber}` : ""}`);
    return response.data;
};

export const customerTransferApi = async (data) => {
    const response = await api.post("customers/transfer/", data);
    return response.data;
};

export const customerDepositApi = async (data) => {
    const response = await api.post("customers/deposit/", data);
    return response.data;
};

export const fetchCustomerTransactionsApi = async (accountNumber) => {
    const response = await api.get(`customers/transactions/${accountNumber ? `?account_number=${accountNumber}` : ""}`);
    return response.data;
};
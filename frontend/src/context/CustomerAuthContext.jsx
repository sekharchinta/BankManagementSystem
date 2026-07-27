import { createContext, useContext, useState, useEffect } from "react";
import { loginCustomerApi, fetchCustomerMeApi } from "../services/customerService";

const CustomerAuthContext = createContext();

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    const saved = localStorage.getItem("customer_info");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeAccount, setActiveAccount] = useState(() => {
    const saved = localStorage.getItem("customer_active_account");
    return saved ? JSON.parse(saved) : null;
  });

  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem("customer_accounts");
    return saved ? JSON.parse(saved) : [];
  });

  const [token, setToken] = useState(() => localStorage.getItem("customer_access"));
  const [loading, setLoading] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    if (customer) localStorage.setItem("customer_info", JSON.stringify(customer));
    else localStorage.removeItem("customer_info");

    if (activeAccount) localStorage.setItem("customer_active_account", JSON.stringify(activeAccount));
    else localStorage.removeItem("customer_active_account");

    if (accounts) localStorage.setItem("customer_accounts", JSON.stringify(accounts));
    else localStorage.removeItem("customer_accounts");

    if (token) localStorage.setItem("customer_access", token);
    else localStorage.removeItem("customer_access");
  }, [customer, activeAccount, accounts, token]);

  const loginCustomer = async (identifier, credential) => {
    setLoading(true);
    try {
      const data = await loginCustomerApi({ identifier, credential });
      
      // Store JWT token
      localStorage.setItem("access", data.access);
      if (data.refresh) localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("user_role", "CUSTOMER");
      
      setToken(data.access);
      setCustomer(data.customer);
      setAccounts(data.accounts || []);
      setActiveAccount(data.primary_account || (data.accounts ? data.accounts[0] : null));
      return { success: true, data };
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Login failed. Please check your credentials.";
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const refreshCustomerData = async () => {
    if (!activeAccount?.account_number) return;
    try {
      const data = await fetchCustomerMeApi(activeAccount.account_number);
      if (data.customer) setCustomer(data.customer);
      if (data.accounts) setAccounts(data.accounts);
      if (data.primary_account) {
        // Update balance of current active account
        const updatedAcc = data.accounts.find(a => a.account_number === activeAccount.account_number) || data.primary_account;
        setActiveAccount(updatedAcc);
      }
    } catch (err) {
      console.error("Failed to refresh customer data:", err);
    }
  };

  const logoutCustomer = () => {
    setCustomer(null);
    setActiveAccount(null);
    setAccounts([]);
    setToken(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user_role");
    localStorage.removeItem("customer_access");
    localStorage.removeItem("customer_info");
    localStorage.removeItem("customer_active_account");
    localStorage.removeItem("customer_accounts");
  };

  return (
    <CustomerAuthContext.Provider
      value={{
        customer,
        activeAccount,
        setActiveAccount,
        accounts,
        token,
        loading,
        loginCustomer,
        logoutCustomer,
        refreshCustomerData,
        isAuthenticated: !!token && !!customer
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
}

export const useCustomerAuth = () => useContext(CustomerAuthContext);

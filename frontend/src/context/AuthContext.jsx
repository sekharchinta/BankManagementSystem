import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { staffLogin, getProfile } from "../services/auth";
import { customerLogin, customerRegister, customerMe } from "../services/customers";
import { clearSession } from "../lib/api";

const AuthContext = createContext(null);

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => localStorage.getItem("user_role") || null);
  const [customer, setCustomer] = useState(() => readJson("customer_info"));
  const [accounts, setAccounts] = useState(() => readJson("customer_accounts") || []);
  const [activeAccount, setActiveAccount] = useState(() =>
    readJson("customer_active_account")
  );
  const [staffProfile, setStaffProfile] = useState(() => readJson("staff_profile"));

  const persist = useCallback((key, value) => {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, []);

  const loginStaff = useCallback(async (credentials) => {
    const data = await staffLogin(credentials);
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("user_role", "STAFF");
    setRole("STAFF");
    try {
      const profile = await getProfile();
      setStaffProfile(profile);
    } catch {
      /* profile fetch is non-critical */
    }
    return data;
  }, []);

  const applyCustomerSession = useCallback((data) => {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("user_role", "CUSTOMER");

    setRole("CUSTOMER");
    setCustomer(data.customer);
    setAccounts(data.accounts || []);
    setActiveAccount(data.primary_account || (data.accounts && data.accounts[0]) || null);
    return data;
  }, []);

  const loginCustomer = useCallback(async (identifier, credential) => {
    const data = await customerLogin({ identifier, credential });
    return applyCustomerSession(data);
  }, [applyCustomerSession]);

  const registerCustomer = useCallback(async (payload) => {
    const data = await customerRegister(payload);
    return applyCustomerSession(data);
  }, [applyCustomerSession]);

  const refreshCustomer = useCallback(async () => {
    if (!activeAccount?.account_number) return null;
    const data = await customerMe(activeAccount.account_number);
    if (data.customer) setCustomer(data.customer);
    if (data.accounts) {
      setAccounts(data.accounts);
      const matched =
        data.accounts.find((a) => a.account_number === activeAccount.account_number) ||
        data.primary_account ||
        data.accounts[0];
      setActiveAccount(matched);
    }
    return data;
  }, [activeAccount?.account_number]);

  const switchAccount = useCallback((accountNumber) => {
    const next = accounts.find((a) => a.account_number === accountNumber);
    if (next) setActiveAccount(next);
  }, [accounts]);

  const logout = useCallback(() => {
    clearSession();
    setRole(null);
    setCustomer(null);
    setAccounts([]);
    setActiveAccount(null);
    setStaffProfile(null);
  }, []);

  useEffect(() => {
    persist("customer_info", customer);
    persist("customer_accounts", accounts);
    persist("customer_active_account", activeAccount);
    persist("staff_profile", staffProfile);
  }, [customer, accounts, activeAccount, staffProfile, persist]);

  const value = useMemo(
    () => ({
      role,
      isStaff: role === "STAFF",
      isCustomer: role === "CUSTOMER",
      isAuthenticated: Boolean(role),
      customer,
      accounts,
      activeAccount,
      staffProfile,
      setStaffProfile,
      loginStaff,
      loginCustomer,
      registerCustomer,
      refreshCustomer,
      switchAccount,
      logout,
    }),
    [
      role,
      customer,
      accounts,
      activeAccount,
      staffProfile,
      loginStaff,
      loginCustomer,
      registerCustomer,
      refreshCustomer,
      switchAccount,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

import { createContext, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("access")
    );

    const login = (access, refresh) => {
        localStorage.setItem("access", access);
        localStorage.setItem("refresh", refresh);
        setToken(access);
    };

    const logout = () => {
        localStorage.clear();
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
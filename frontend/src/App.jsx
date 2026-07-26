import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;

const { isAuthenticated } = useContext(AuthContext);

<Route
    path="/"
    element={
        isAuthenticated
            ? <Navigate to="/dashboard" replace />
            : <Login />
    }
    path="/accounts"
    element={
        <ProtectedRoute>

            <Accounts />

        </ProtectedRoute>
    }

/>

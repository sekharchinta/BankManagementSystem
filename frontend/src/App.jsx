import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { CustomerAuthProvider } from "./context/CustomerAuthContext";

function App() {
  return (
    <ThemeProvider>
      <CustomerAuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              borderRadius: "12px",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              padding: "12px 16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#fff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
            },
          }}
        />
      </CustomerAuthProvider>
    </ThemeProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Background3D from "./components/Background3D";
import { isAuthenticated } from "./utils/authUtils";
import Community from "./pages/Community";

// Clears expired token on every route change
function AuthGuard() {
  const location = useLocation();
  useEffect(() => {
    isAuthenticated(); // This auto-removes expired/invalid tokens
  }, [location.pathname]);
  return null;
}

// Protected route wrapper
function Protected({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Background3D />
      <AuthGuard />

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.875rem",
            fontWeight: "500",
            borderRadius: "12px",
            padding: "12px 18px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
          },
          success: {
            style: { background: "#0d1626", color: "#f1f5f9", border: "1px solid rgba(16,185,129,0.3)" },
            iconTheme: { primary: "#10b981", secondary: "#0d1626" }
          },
          error: {
            style: { background: "#0d1626", color: "#f1f5f9", border: "1px solid rgba(248,113,113,0.3)" },
            iconTheme: { primary: "#f87171", secondary: "#0d1626" }
          },
          loading: {
            style: { background: "#0d1626", color: "#f1f5f9", border: "1px solid rgba(99,102,241,0.3)" }
          }
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes - auto redirects to login if not authenticated */}
        <Route path="/dashboard" element={
          <Protected><Dashboard /></Protected>
        } />
        <Route path="/community" element={
          <Protected><Community /></Protected>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

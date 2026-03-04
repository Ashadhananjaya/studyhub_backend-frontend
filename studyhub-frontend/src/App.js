
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Background3D from "./components/Background3D";
import { isAuthenticated } from "./utils/authUtils";
import Community from "./pages/Community";


function App() {
  return (
    <BrowserRouter>
      <Background3D />
      <Routes>
        {/* 1. New Home Route */}
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />
          }
        />
        <Route
  path="/community"
  element={
    isAuthenticated() ? <Community /> : <Navigate to="/login" />
  }
/>
       

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
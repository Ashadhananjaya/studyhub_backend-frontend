// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import Background3D from "./components/Background3D"; // Our new 3D logic
// import { isAuthenticated } from "./utils/authUtils";

// function App() {
//   return (
//     <BrowserRouter>
//       {/* 1. The 3D Background sits here so it stays active 
//              behind all pages during navigation.
//       */}
//       <Background3D />

//       <Routes>
//         {/* Public Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         {/* Protected Route: 
//             Kept your exact logic - if authenticated, show Dashboard, 
//             else redirect to Login. 
//         */}
//         <Route
//           path="/dashboard"
//           element={
//             isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />
//           }
//         />

//         {/* Default Redirect */}
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Background3D from "./components/Background3D";
import { isAuthenticated } from "./utils/authUtils";

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

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
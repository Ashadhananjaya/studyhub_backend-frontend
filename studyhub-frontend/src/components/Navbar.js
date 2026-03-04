import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>StudyHub</Link>
      <div style={styles.links}>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={styles.themeBtn}>
          {theme === 'dark' ? "LIGHT" : "DARK"}
        </button>
        {isLoggedIn ? (
          <button style={styles.logoutBtn} onClick={handleLogout}>LOGOUT</button>
        ) : (
          <Link to="/login" style={styles.navLink}>LOGIN</Link>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { height: "70px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 5%", background: "var(--bg)", borderBottom: "1px solid var(--border)" },
  logo: { fontSize: "1.2rem", fontWeight: "800", color: "var(--text)", textDecoration: "none" },
  links: { display: "flex", alignItems: "center", gap: "20px" },
  themeBtn: { background: "#6366f1", color: "white", border: "none", padding: "8px 15px", borderRadius: "10px", cursor: "pointer" },
  logoutBtn: { background: "none", border: "none", color: "#f87171", cursor: "pointer", fontWeight: "bold" },
  navLink: { color: "var(--text)", textDecoration: "none", fontWeight: "bold" }
};
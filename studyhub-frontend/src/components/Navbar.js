import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logout, isAuthenticated } from "../utils/authUtils";

export default function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>Study<span>Hub</span></Link>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.navLink}>My Notes</Link>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={styles.themeBtn}>
          {theme === 'dark' ? "LIGHT" : "DARK"}
        </button>
        {isAuthenticated() && (
          <button style={styles.logoutBtn} onClick={() => { logout(); navigate("/login"); }}>LOGOUT</button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: { 
    height: "75px",
    display: "flex", justifyContent: "space-between", alignItems: "center", 
    padding: "0 6%", background: "var(--bg)", 
    borderBottom: "1px solid var(--border)", 
    position: "sticky", top: 0, 
    zIndex: 9999, /* Prevents all overlapping */
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
  },
  logo: { fontSize: "1.4rem", fontWeight: "800", color: "var(--text)", textDecoration: "none" },
  links: { display: "flex", alignItems: "center", gap: "2rem" },
  navLink: { color: "var(--text)", textDecoration: "none", fontWeight: "600", fontSize: "0.85rem", opacity: 0.8 },
  themeBtn: { background: "var(--accent)", color: "white", border: "none", padding: "8px 18px", borderRadius: "12px", cursor: "pointer", fontSize: "0.75rem", fontWeight: "700" },
  logoutBtn: { background: "none", border: "none", color: "#f87171", cursor: "pointer", fontWeight: "700", fontSize: "0.85rem" }
};
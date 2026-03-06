import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, LayoutDashboard, Users, Sun, Moon, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", label: "My Notes",  icon: <LayoutDashboard size={15} /> },
    { to: "/community", label: "Community", icon: <Users size={15} /> }
  ];

  return (
    <nav style={s.nav}>
      {/* Logo */}
      <Link to="/dashboard" style={s.logo}>
        <div style={s.logoIcon}><BookOpen size={16} color="#fff" /></div>
        <span style={s.logoText}>StudyHub</span>
      </Link>

      {/* Nav links */}
      <div style={s.links}>
        {navLinks.map(({ to, label, icon }) => {
          const active = location.pathname === to;
          return (
            <Link key={to} to={to} style={{ ...s.navLink, ...(active ? s.navLinkActive : {}) }}>
              {icon}
              <span>{label}</span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  style={s.indicator}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Right side */}
      <div style={s.right}>
        <motion.button
          style={s.iconBtn}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Toggle theme"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>

        <motion.button
          style={{ ...s.iconBtn, color: "var(--danger)" }}
          onClick={logout}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Logout"
        >
          <LogOut size={16} />
        </motion.button>
      </div>
    </nav>
  );
}

const s = {
  nav: {
    height: "64px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
    background: "var(--panel)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 100
  },
  logo: { display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" },
  logoIcon: { width: "30px", height: "30px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "var(--text)", fontStyle: "italic" },
  links: { display: "flex", gap: "4px" },
  navLink: {
    display: "flex", alignItems: "center", gap: "7px",
    textDecoration: "none", color: "var(--text-muted)",
    fontSize: "0.875rem", fontWeight: "500",
    padding: "8px 14px", borderRadius: "10px",
    position: "relative", transition: "color 0.2s, background 0.2s"
  },
  navLinkActive: { color: "var(--text)", background: "var(--accent-dim)" },
  indicator: { position: "absolute", inset: 0, borderRadius: "10px", background: "var(--accent-dim)", zIndex: -1 },
  right: { display: "flex", alignItems: "center", gap: "4px" },
  iconBtn: {
    background: "none", border: "none", color: "var(--text-muted)",
    cursor: "pointer", padding: "8px", borderRadius: "10px",
    display: "flex", alignItems: "center", transition: "background 0.2s"
  }
};

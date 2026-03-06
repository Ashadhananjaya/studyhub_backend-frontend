import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, BookOpen } from "lucide-react";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* ── LEFT PANEL ── */}
      <div style={styles.leftPanel}>

        {/* Animated background orbs */}
        <div style={{ ...styles.orb, ...styles.orb1 }} />
        <div style={{ ...styles.orb, ...styles.orb2 }} />
        <div style={{ ...styles.orb, ...styles.orb3 }} />

        <div style={styles.leftContent}>

          {/* Logo */}
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>
              <BookOpen size={20} color="#fff" />
            </div>
            <span style={styles.logoText}>StudyHub</span>
          </div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <h1 style={styles.leftHeadline}>
              Your second<br />
              <em style={styles.italic}>brain,</em> finally<br />
              organized.
            </h1>
            <p style={styles.leftSub}>
              Capture ideas, share knowledge,<br />
              and connect with learners.
            </p>
          </motion.div>

          {/* Floating card decoration */}
          <motion.div
            style={styles.floatingCard}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <div style={styles.fcDot} />
            <div style={styles.fcLines}>
              <div style={{ ...styles.fcLine, width: "60%" }} />
              <div style={{ ...styles.fcLine, width: "80%" }} />
              <div style={{ ...styles.fcLine, width: "45%" }} />
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={styles.rightPanel}>
        <motion.div
          style={{ ...styles.formCard, ...(shake ? { animation: "shake 0.4s ease" } : {}) }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >

          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Welcome back</h2>
            <p style={styles.formSub}>Sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>

            {error && (
              <motion.div
                style={styles.errorBox}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputWrapper}>
                <Mail size={16} style={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <Lock size={16} style={styles.inputIcon} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              style={styles.submitBtn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : (
                <span style={styles.btnInner}>
                  Sign In <ArrowRight size={16} />
                </span>
              )}
            </motion.button>

          </form>

          <p style={styles.switchText}>
            Don't have an account?{" "}
            <Link to="/signup" style={styles.switchLink}>Create one</Link>
          </p>

        </motion.div>
      </div>

    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#070d1a",
    fontFamily: "'DM Sans', sans-serif"
  },

  // LEFT
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #0d1626 0%, #0f172a 50%, #120820 100%)",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    padding: "60px",
    borderRight: "1px solid rgba(255,255,255,0.06)"
  },
  orb: {
    position: "absolute",
    borderRadius: "50%",
    filter: "blur(80px)",
    opacity: 0.25,
    animation: "orb-drift 12s ease-in-out infinite"
  },
  orb1: { width: "400px", height: "400px", background: "#4f46e5", top: "-100px", left: "-100px" },
  orb2: { width: "300px", height: "300px", background: "#7c3aed", bottom: "0", right: "0", animationDelay: "-4s" },
  orb3: { width: "200px", height: "200px", background: "#0ea5e9", top: "50%", left: "40%", animationDelay: "-8s" },
  leftContent: { position: "relative", zIndex: 1 },
  logoRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "60px" },
  logoIcon: {
    width: "36px", height: "36px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  logoText: { fontSize: "1.1rem", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.3px" },
  leftHeadline: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
    color: "#f1f5f9",
    lineHeight: 1.15,
    marginBottom: "20px"
  },
  italic: { fontStyle: "italic", color: "#818cf8" },
  leftSub: { color: "rgba(241,245,249,0.5)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "50px" },
  floatingCard: {
    background: "rgba(255,255,255,0.05)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "20px",
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    maxWidth: "280px"
  },
  fcDot: { width: "10px", height: "10px", borderRadius: "50%", background: "#10b981", marginTop: "5px", flexShrink: 0 },
  fcLines: { flex: 1, display: "flex", flexDirection: "column", gap: "8px" },
  fcLine: { height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px" },

  // RIGHT
  rightPanel: {
    width: "480px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    background: "#070d1a"
  },
  formCard: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "40px"
  },
  formHeader: { marginBottom: "32px" },
  formTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "1.9rem",
    color: "#f1f5f9",
    marginBottom: "6px"
  },
  formSub: { color: "rgba(241,245,249,0.45)", fontSize: "0.9rem" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  errorBox: {
    background: "rgba(248,113,113,0.1)",
    border: "1px solid rgba(248,113,113,0.2)",
    color: "#fca5a5",
    padding: "12px 16px",
    borderRadius: "10px",
    fontSize: "0.85rem"
  },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.82rem", fontWeight: "600", color: "rgba(241,245,249,0.6)", letterSpacing: "0.3px" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: "14px", color: "rgba(241,245,249,0.3)", pointerEvents: "none" },
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "12px 16px 12px 42px",
    color: "#f1f5f9",
    fontSize: "0.95rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "'DM Sans', sans-serif"
  },
  submitBtn: {
    width: "100%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "14px",
    fontSize: "0.95rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
    fontFamily: "'DM Sans', sans-serif"
  },
  btnInner: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  switchText: { textAlign: "center", marginTop: "24px", color: "rgba(241,245,249,0.4)", fontSize: "0.875rem" },
  switchLink: { color: "#818cf8", textDecoration: "none", fontWeight: "600" }
};

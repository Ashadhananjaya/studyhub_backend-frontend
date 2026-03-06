import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, BookOpen } from "lucide-react";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // FIX 1: field is 'username' not 'name'
      // FIX 2: endpoint is '/signup' not '/register'
      await axios.post("http://localhost:8080/api/auth/signup", { username, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* ── LEFT PANEL ── */}
      <div style={styles.leftPanel}>
        <div style={{ ...styles.orb, ...styles.orb1 }} />
        <div style={{ ...styles.orb, ...styles.orb2 }} />
        <div style={{ ...styles.orb, ...styles.orb3 }} />

        <div style={styles.leftContent}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>
              <BookOpen size={20} color="#fff" />
            </div>
            <span style={styles.logoText}>StudyHub</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <h1 style={styles.leftHeadline}>
              Join a community<br />
              of <em style={styles.italic}>curious</em><br />
              minds.
            </h1>
            <p style={styles.leftSub}>
              Create your account and start building<br />
              your personal knowledge base today.
            </p>
          </motion.div>

          {/* Stats cards - FIX 3: use CSS variables so light theme works */}
          <motion.div
            style={styles.statsRow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[["Free", "Forever"], ["Public", "Notes"], ["Markdown", "Support"]].map(([val, label]) => (
              <div key={label} style={styles.statItem}>
                <div style={styles.statVal}>{val}</div>
                <div style={styles.statLabel}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={styles.rightPanel}>
        <motion.div
          style={styles.formCard}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Create account</h2>
            <p style={styles.formSub}>Start your learning journey</p>
          </div>

          <form onSubmit={handleSignup} style={styles.form}>

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
              <label style={styles.label}>Username</label>
              <div style={styles.inputWrapper}>
                <User size={16} style={styles.inputIcon} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  style={styles.input}
                  required
                />
              </div>
            </div>

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
                  placeholder="Min. 6 characters"
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
              {loading ? "Creating account..." : (
                <span style={styles.btnInner}>
                  Create Account <ArrowRight size={16} />
                </span>
              )}
            </motion.button>

          </form>

          <p style={styles.switchText}>
            Already have an account?{" "}
            <Link to="/login" style={styles.switchLink}>Sign in</Link>
          </p>

        </motion.div>
      </div>

    </div>
  );
}

const styles = {
  // Page always dark - login/signup pages don't follow theme
  page: { display: "flex", minHeight: "100vh", background: "#070d1a", fontFamily: "'DM Sans', sans-serif" },

  leftPanel: { flex: 1, background: "linear-gradient(135deg, #0d1626 0%, #0f172a 50%, #120820 100%)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", padding: "60px", borderRight: "1px solid rgba(255,255,255,0.06)" },
  orb: { position: "absolute", borderRadius: "50%", filter: "blur(80px)", opacity: 0.25, animation: "orb-drift 12s ease-in-out infinite" },
  orb1: { width: "400px", height: "400px", background: "#7c3aed", bottom: "-100px", right: "-100px" },
  orb2: { width: "300px", height: "300px", background: "#0ea5e9", top: "0", left: "30%", animationDelay: "-4s" },
  orb3: { width: "200px", height: "200px", background: "#10b981", top: "20%", left: "0", animationDelay: "-8s" },

  leftContent: { position: "relative", zIndex: 1 },
  logoRow: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "60px" },
  logoIcon: { width: "36px", height: "36px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { fontSize: "1.1rem", fontWeight: "700", color: "#f1f5f9", letterSpacing: "-0.3px" },

  leftHeadline: { fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.2rem, 4vw, 3.2rem)", color: "#f1f5f9", lineHeight: 1.15, marginBottom: "20px" },
  italic: { fontStyle: "italic", color: "#34d399" },
  leftSub: { color: "rgba(241,245,249,0.5)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "50px" },

  // FIX: stat cards now visible in both themes since login page is always dark
  statsRow: { display: "flex", gap: "24px" },
  statItem: {
    display: "flex", flexDirection: "column", gap: "4px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    padding: "14px 20px"
  },
  statVal: { fontSize: "1rem", fontWeight: "700", color: "#f1f5f9" },
  statLabel: { fontSize: "0.72rem", color: "rgba(241,245,249,0.55)", textTransform: "uppercase", letterSpacing: "0.6px" },

  rightPanel: { width: "480px", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", background: "#070d1a" },
  formCard: { width: "100%", background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "40px" },
  formHeader: { marginBottom: "32px" },
  formTitle: { fontFamily: "'DM Serif Display', serif", fontSize: "1.9rem", color: "#f1f5f9", marginBottom: "6px" },
  formSub: { color: "rgba(241,245,249,0.45)", fontSize: "0.9rem" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  errorBox: { background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.2)", color: "#fca5a5", padding: "12px 16px", borderRadius: "10px", fontSize: "0.85rem" },
  inputGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "0.82rem", fontWeight: "600", color: "rgba(241,245,249,0.6)", letterSpacing: "0.3px" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: "14px", color: "rgba(241,245,249,0.3)", pointerEvents: "none" },
  input: { width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px 12px 42px", color: "#f1f5f9", fontSize: "0.95rem", outline: "none", fontFamily: "'DM Sans', sans-serif" },
  submitBtn: { width: "100%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", borderRadius: "12px", padding: "14px", fontSize: "0.95rem", fontWeight: "600", cursor: "pointer", marginTop: "4px", fontFamily: "'DM Sans', sans-serif" },
  btnInner: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" },
  switchText: { textAlign: "center", marginTop: "24px", color: "rgba(241,245,249,0.4)", fontSize: "0.875rem" },
  switchLink: { color: "#818cf8", textDecoration: "none", fontWeight: "600" }
};

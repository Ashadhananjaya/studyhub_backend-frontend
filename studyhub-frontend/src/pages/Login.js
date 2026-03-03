import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-in">
        <h2 style={styles.title}>Study<span>Hub</span></h2>
        <p style={styles.subtitle}>Welcome back! Please enter your details.</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputWrapper}>
            <input
              style={styles.input}
              type="email"
              placeholder="Email Address"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div style={styles.inputWrapper}>
            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button 
            type="submit" 
            style={{...styles.button, opacity: loading ? 0.7 : 1}}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <Link to="/signup" style={styles.link}>Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    background: "rgba(15, 23, 42, 0.7)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    padding: "50px 40px",
    borderRadius: "28px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
  },
  title: { 
    color: "white", 
    fontSize: "2.5rem", 
    marginBottom: "10px", 
    fontWeight: "700",
    letterSpacing: "-1px"
  },
  subtitle: { color: "#94a3b8", marginBottom: "35px", fontSize: "0.95rem" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  inputWrapper: { position: "relative" },
  input: {
    width: "100%",
    padding: "16px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "white",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.3s ease",
  },
  button: {
    padding: "16px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    color: "white",
    fontWeight: "600",
    fontSize: "1.1rem",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
    transition: "transform 0.2s ease",
  },
  footer: { marginTop: "25px", color: "#94a3b8", fontSize: "0.9rem" },
  link: { color: "#818cf8", textDecoration: "none", fontWeight: "600" }
};
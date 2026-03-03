import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signupUser(form);
      localStorage.setItem("token", res.data.jwt);
      navigate("/dashboard");
    } catch (err) {
      alert("Signup failed. That email might already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card} className="fade-in">
        <h2 style={styles.title}>Join Us</h2>
        <p style={styles.subtitle}>Create your StudyHub account today.</p>

        <form onSubmit={handleSignup} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Username"
            required
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            style={styles.input}
            type="email"
            placeholder="Email Address"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button 
            type="submit" 
            style={{...styles.button, opacity: loading ? 0.7 : 1}}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
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
  title: { color: "white", fontSize: "2.5rem", marginBottom: "10px", fontWeight: "700" },
  subtitle: { color: "#94a3b8", marginBottom: "35px", fontSize: "0.95rem" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
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
  },
  footer: { marginTop: "25px", color: "#94a3b8", fontSize: "0.9rem" },
  link: { color: "#818cf8", textDecoration: "none", fontWeight: "600" }
};
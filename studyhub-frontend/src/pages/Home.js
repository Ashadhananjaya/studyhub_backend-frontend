import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.hero} className="fade-in">

        <div style={styles.badge}>v2.0 Now Live</div>

        <h1 style={styles.title}>
          Your Second Brain, <br />
          <span style={styles.gradientText}>Digitally Connected.</span>
        </h1>

        <p style={styles.subtitle}>
          StudyHub helps you capture thoughts, organize research, and connect
          the dots within a beautiful 3D neural network environment.
        </p>

        <div style={styles.ctaGroup}>
          <Link to="/signup" style={styles.primaryBtn}>Start Building Your Web</Link>
          <Link to="/login" style={styles.secondaryBtn}>Sign In</Link>
        </div>

        <div style={styles.features}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔐</div>
            <h3 style={styles.featureTitle}>Secure JWT</h3>
            <p style={styles.featureText}>Industry-standard encryption for your private thoughts.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🌍</div>
            <h3 style={styles.featureTitle}>Public Sharing</h3>
            <p style={styles.featureText}>Toggle notes to public and collaborate with the community.</p>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🕸️</div>
            <h3 style={styles.featureTitle}>3D Neural Web</h3>
            <p style={styles.featureText}>Visualize your notes as connected nodes in real-time.</p>
          </div>
        </div>

      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    position: "relative",
    zIndex: 1,
    background: "var(--bg)"
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "80px 20px"
  },
  badge: {
    background: "var(--accent-dim)",
    color: "var(--accent-light)",
    padding: "8px 20px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "700",
    marginBottom: "30px",
    border: "1px solid var(--border-hover)",
    letterSpacing: "1px"
  },
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
    color: "var(--text)",
    margin: "0 0 25px 0",
    lineHeight: 1.1,
    letterSpacing: "-2px"
  },
  gradientText: {
    background: "linear-gradient(90deg, #818cf8, #c084fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "inline-block"
  },
  subtitle: {
    maxWidth: "650px",
    color: "var(--text-muted)",
    fontSize: "1.1rem",
    lineHeight: 1.7,
    marginBottom: "45px"
  },
  ctaGroup: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: "20px"
  },
  primaryBtn: {
    padding: "16px 32px",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    color: "white",
    textDecoration: "none",
    borderRadius: "14px",
    fontWeight: "600",
    fontSize: "1rem",
    boxShadow: "0 10px 25px -5px rgba(99,102,241,0.4)"
  },
  secondaryBtn: {
    padding: "16px 32px",
    background: "var(--panel)",
    color: "var(--text)",
    textDecoration: "none",
    borderRadius: "14px",
    border: "1px solid var(--border-hover)",
    fontWeight: "600",
    fontSize: "1rem",
    backdropFilter: "blur(10px)"
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    width: "100%",
    maxWidth: "1100px",
    marginTop: "80px"
  },
  featureCard: {
    padding: "36px",
    background: "var(--panel)",
    borderRadius: "20px",
    border: "1px solid var(--border)",
    textAlign: "left",
    backdropFilter: "blur(10px)"
  },
  featureIcon: {
    fontSize: "1.8rem",
    marginBottom: "16px"
  },
  featureTitle: {
    fontFamily: "'DM Serif Display', serif",
    color: "var(--text)",
    marginBottom: "12px",
    fontSize: "1.2rem"
  },
  featureText: {
    color: "var(--text-muted)",
    lineHeight: 1.6,
    margin: 0,
    fontSize: "0.9rem"
  }
};

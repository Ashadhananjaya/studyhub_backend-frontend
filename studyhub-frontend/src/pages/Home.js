import React from "react"; // Added React import for safety
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
          StudyHub helps you capture thoughts, organize research, and connect the dots 
          within a beautiful 3D neural network environment.
        </p>

        <div style={styles.ctaGroup}>
          <Link to="/signup" style={styles.primaryBtn}>Start Building Your Web</Link>
          <Link to="/login" style={styles.secondaryBtn}>Sign In</Link>
        </div>

        <div style={styles.features}>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>Secure JWT</h3>
            <p style={styles.featureText}>Industry-standard encryption for your private thoughts.</p>
          </div>
          <div style={styles.featureCard}>
            <h3 style={styles.featureTitle}>Public Sharing</h3>
            <p style={styles.featureText}>Toggle notes to public and collaborate with the community.</p>
          </div>
          <div style={styles.featureCard}>
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
    zIndex: 1 // Ensures it sits above the 3D canvas
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
    background: "rgba(99, 102, 241, 0.15)", 
    color: "#818cf8", 
    padding: "8px 20px", 
    borderRadius: "20px", 
    fontSize: "0.85rem", 
    fontWeight: "700", 
    marginBottom: "30px",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    letterSpacing: "1px"
  },
  title: { 
    fontSize: "clamp(2.5rem, 8vw, 4.5rem)", // Responsive font size
    color: "white", 
    margin: "0 0 25px 0", 
    lineHeight: "1.1", 
    fontWeight: "800",
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
    color: "#94a3b8", 
    fontSize: "1.2rem", 
    lineHeight: "1.7", 
    marginBottom: "45px" 
  },
  ctaGroup: { 
    display: "flex", 
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  primaryBtn: { 
    padding: "18px 36px", 
    background: "#6366f1", 
    color: "white", 
    textDecoration: "none", 
    borderRadius: "14px", 
    fontWeight: "600", 
    fontSize: "1.1rem",
    boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)",
    transition: "transform 0.2s ease"
  },
  secondaryBtn: { 
    padding: "18px 36px", 
    background: "rgba(255,255,255,0.05)", 
    color: "white", 
    textDecoration: "none", 
    borderRadius: "14px", 
    border: "1px solid rgba(255,255,255,0.1)", 
    fontWeight: "600",
    fontSize: "1.1rem",
    backdropFilter: "blur(10px)"
  },
  features: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
    gap: "30px", 
    width: "100%", 
    maxWidth: "1100px", 
    marginTop: "100px" 
  },
  featureCard: { 
    padding: "40px", 
    background: "rgba(30, 41, 59, 0.4)", 
    borderRadius: "24px", 
    border: "1px solid rgba(255,255,255,0.05)", 
    textAlign: "left",
    backdropFilter: "blur(10px)"
  },
  featureTitle: { color: "white", marginBottom: "15px", fontSize: "1.3rem" },
  featureText: { color: "#94a3b8", lineHeight: "1.6", margin: 0 }
};
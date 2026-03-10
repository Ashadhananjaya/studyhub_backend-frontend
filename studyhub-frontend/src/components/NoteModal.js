import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { X, Sparkles, Loader2, ChevronDown, Heart, Globe, Lock } from "lucide-react";

export default function NoteModal({ note, onClose }) {
  const [summary, setSummary]       = useState("");
  const [loadingAI, setLoadingAI]   = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [aiDone, setAiDone]         = useState(false);
  const [shimmer, setShimmer]       = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSummarize = async () => {
    if (aiDone) { setSummaryOpen((o) => !o); return; }
    setLoadingAI(true);
    setSummaryOpen(true);
    try {
      const res = await fetch("http://localhost:8000/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: note.content }),
      });
      const data = await res.json();
      setSummary(data.summary || "No summary generated.");
      setAiDone(true);
      setShimmer(true);
      setTimeout(() => setShimmer(false), 1200);
    } catch {
      setSummary("⚠️ Could not connect to AI service.");
      setAiDone(true);
    } finally {
      setLoadingAI(false);
    }
  };

  const dateStr = note.createdAt
    ? new Date(note.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        style={s.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal Panel — 75vw × 85vh */}
      <motion.div
  style={s.panel}
  initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-45%" }}
  animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
  exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-45%" }}
  transition={{ type: "spring", damping: 25, stiffness: 300 }}
>

        {/* ── TOP BAR ── */}
        <div style={s.topBar}>

          {/* AI Badge */}
          <div style={s.aiBadge}>
            <div style={s.aiOrb}>
              <div style={s.aiOrbInner} />
            </div>
            <span style={s.aiLabel}>AI Enhanced</span>
            <div style={s.aiPill}>
              <Sparkles size={10} />
              <span>v2</span>
            </div>
          </div>

          {/* Note meta */}
          <div style={s.metaRow}>
            <span style={{ ...s.visTag, ...(note.isPublic ? s.visPublic : s.visPrivate) }}>
              {note.isPublic ? <><Globe size={10} /> Public</> : <><Lock size={10} /> Private</>}
            </span>
            {dateStr && <span style={s.dateStr}>{dateStr}</span>}
            {note.likes > 0 && (
              <span style={s.likesTag}>
                <Heart size={10} fill="var(--danger)" color="var(--danger)" />
                {note.likes}
              </span>
            )}
          </div>

          {/* Close */}
          <motion.button
            style={s.closeBtn}
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={16} />
          </motion.button>
        </div>

        {/* ── CONTENT SCROLL AREA ── */}
        <div style={s.body}>

          {/* Title */}
          <motion.h1
            style={s.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            {note.title}
          </motion.h1>

          {/* Divider with AI button */}
          <div style={s.dividerRow}>
            <div style={s.divider} />
            <motion.button
              style={s.aiBtn}
              onClick={handleSummarize}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              disabled={loadingAI}
            >
              {loadingAI ? (
                <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <Sparkles size={13} />
              )}
              {aiDone ? (summaryOpen ? "Hide Summary" : "Show Summary") : "Summarize with AI"}
            </motion.button>
            <div style={s.divider} />
          </div>

          {/* AI Summary panel */}
          <AnimatePresence>
            {summaryOpen && (
              <motion.div
                style={{ ...s.summaryBox, ...(shimmer ? s.shimmer : {}) }}
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: "28px" }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.35 }}
              >
                <div style={s.summaryHeader}>
                  <div style={s.summaryDot} />
                  <span style={s.summaryTitle}>AI Summary</span>
                </div>
                {loadingAI ? (
                  <div style={s.summaryLoading}>
                    {[0.1, 0.2, 0.35].map((d, i) => (
                      <div key={i} style={{ ...s.skLine, width: i === 2 ? "55%" : "100%", animationDelay: `${d}s` }} className="skeleton" />
                    ))}
                  </div>
                ) : (
                  <p style={s.summaryText}>{summary}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Full note content */}
          <motion.div
            style={s.markdown}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.18 }}
          >
            <ReactMarkdown>{note.content}</ReactMarkdown>
          </motion.div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}

const s = {
  // Overlay
  backdrop: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(6px)",
    zIndex: 999,
  },

  // Panel — slides in from right, takes 75% width
 panel: {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)", // Forces true center
  width: "85vw",
  maxWidth: "900px",
  height: "85vh",
  background: "var(--panel)",
  borderRadius: "24px",
  border: "1px solid var(--border)",
  zIndex: 1000,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  boxShadow: "0 20px 80px rgba(0,0,0,0.45)",
},


  // Top bar
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "18px 28px",
    borderBottom: "1px solid var(--border)",
    flexShrink: 0,
  },

  // AI Badge
  aiBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: "20px",
    padding: "6px 12px 6px 8px",
    flexShrink: 0,
  },
  aiOrb: {
    width: "18px", height: "18px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: "0 0 8px rgba(99,102,241,0.6)",
    animation: "pulse 2s ease-in-out infinite",
  },
  aiOrbInner: {
    width: "6px", height: "6px",
    borderRadius: "50%",
    background: "white",
    opacity: 0.9,
  },
  aiLabel: {
    fontSize: "0.72rem",
    fontWeight: "700",
    color: "var(--accent-light)",
    letterSpacing: "0.4px",
    fontFamily: "'DM Sans', sans-serif",
  },
  aiPill: {
    display: "flex", alignItems: "center", gap: "3px",
    background: "rgba(99,102,241,0.2)",
    borderRadius: "10px",
    padding: "2px 6px",
    fontSize: "0.62rem",
    color: "var(--accent-light)",
    fontWeight: "700",
    fontFamily: "'DM Sans', sans-serif",
  },

  metaRow: {
    display: "flex", alignItems: "center", gap: "10px", flex: 1,
  },
  visTag: {
    display: "flex", alignItems: "center", gap: "4px",
    fontSize: "0.7rem", fontWeight: "700",
    padding: "4px 10px", borderRadius: "20px",
    fontFamily: "'DM Sans', sans-serif",
  },
  visPublic: {
    background: "var(--success-dim)", color: "var(--success)",
  },
  visPrivate: {
    background: "var(--accent-dim)", color: "var(--accent-light)",
  },
  dateStr: {
    fontSize: "0.72rem",
    color: "var(--text-dim)",
    fontFamily: "'DM Sans', sans-serif",
  },
  likesTag: {
    display: "flex", alignItems: "center", gap: "4px",
    fontSize: "0.72rem",
    color: "var(--text-muted)",
    fontFamily: "'DM Sans', sans-serif",
  },

  closeBtn: {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    color: "var(--text-muted)",
    cursor: "pointer",
    padding: "8px",
    display: "flex", alignItems: "center",
    flexShrink: 0,
  },

  // Body / scroll
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "36px 48px 60px",
  },

  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "2.2rem",
    fontWeight: "400",
    color: "var(--text)",
    lineHeight: 1.25,
    marginBottom: "28px",
    marginTop: 0,
  },

  // Divider row with AI button
  dividerRow: {
    display: "flex", alignItems: "center", gap: "16px",
    marginBottom: "24px",
  },
  divider: {
    flex: 1, height: "1px",
    background: "var(--border)",
  },
 aiBtn: {
  display: "flex", alignItems: "center", gap: "8px",
  background: "linear-gradient(135deg, #6366f1, #a855f7)", // Solid gradient
  color: "white",
  border: "none",
  borderRadius: "20px",
  padding: "10px 24px",
  fontSize: "0.85rem",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)", // Glow
  fontFamily: "'DM Sans', sans-serif",
  whiteSpace: "nowrap",
},

  // Summary box
 summaryBox: {
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px dashed rgba(99, 102, 241, 0.3)",
  borderRadius: "16px",
  padding: "20px",
  marginTop: "10px"
},
  shimmer: {
    boxShadow: "0 0 0 2px rgba(99,102,241,0.35), 0 0 24px rgba(99,102,241,0.15)",
  },
  summaryHeader: {
    display: "flex", alignItems: "center", gap: "8px",
    marginBottom: "12px",
  },
  summaryDot: {
    width: "8px", height: "8px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    boxShadow: "0 0 6px rgba(99,102,241,0.7)",
  },
  summaryTitle: {
    fontSize: "0.7rem",
    fontWeight: "700",
    color: "var(--accent-light)",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontFamily: "'DM Sans', sans-serif",
  },
  summaryText: {
    fontSize: "0.92rem",
    color: "var(--text)",
    lineHeight: 1.75,
    margin: 0,
    fontFamily: "'DM Sans', sans-serif",
    fontStyle: "italic",
  },
  summaryLoading: {
    display: "flex", flexDirection: "column", gap: "8px",
  },
  skLine: {
    height: "14px",
    borderRadius: "6px",
  },

  // Markdown content
  markdown: {
    color: "var(--text-muted)",
    fontSize: "1rem",
    lineHeight: 1.85,
    fontFamily: "'DM Sans', sans-serif",
  },
};

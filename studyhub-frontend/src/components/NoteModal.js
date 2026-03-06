import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { X, Heart, Globe, Lock } from "lucide-react";

export default function NoteModal({ note, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  if (!note) return null;

  return ReactDOM.createPortal(
    <motion.div
      style={s.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        style={s.modal}
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.96 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div style={s.header}>
          <div style={s.statusRow}>
            <span
              className="pulse-dot"
              style={{ backgroundColor: note.isPublic ? "var(--success)" : "var(--accent)" }}
            />
            <span style={{ ...s.statusLabel, color: note.isPublic ? "var(--success)" : "var(--accent)" }}>
              {note.isPublic ? "Public" : "Private"}
            </span>
          </div>
          <motion.button
            style={s.closeBtn}
            onClick={onClose}
            whileHover={{ scale: 1.1, background: "var(--panel-hover)" }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={16} />
          </motion.button>
        </div>

        {/* TITLE */}
        <h2 style={s.title}>{note.title}</h2>

        {/* META */}
        <div style={s.meta}>
          <span style={s.date}>
            {note.createdAt
              ? new Date(note.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
              : ""}
          </span>
          <div style={s.metaRight}>
            <Heart size={13} color="var(--danger)" fill="var(--danger)" />
            <span style={s.likes}>{note.likes || 0} likes</span>
          </div>
        </div>

        <div style={s.divider} />

        {/* CONTENT */}
        <div style={s.content}>
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>

        {/* FOOTER */}
        <div style={s.footer}>
          <motion.button
            style={s.closeTextBtn}
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Close
          </motion.button>
        </div>

      </motion.div>
    </motion.div>,
    document.body
  );
}

const s = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "24px" },
  modal: { background: "var(--panel-solid)", border: "1px solid var(--border)", borderRadius: "24px", padding: "36px", width: "100%", maxWidth: "660px", maxHeight: "82vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "18px", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statusRow: { display: "flex", alignItems: "center", gap: "8px" },
  statusLabel: { fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase" },
  closeBtn: { background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "8px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color: "var(--text)", lineHeight: 1.25 },
  meta: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  date: { fontSize: "0.8rem", color: "var(--text-dim)" },
  metaRight: { display: "flex", alignItems: "center", gap: "5px" },
  likes: { fontSize: "0.8rem", color: "var(--text-muted)" },
  divider: { height: "1px", background: "var(--border)" },
  content: { color: "var(--text)", fontSize: "0.95rem", lineHeight: 1.8, flex: 1 },
  footer: { paddingTop: "16px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "flex-end" },
  closeTextBtn: { background: "var(--accent-dim)", color: "var(--accent-light)", border: "none", padding: "10px 24px", borderRadius: "12px", fontWeight: "600", cursor: "pointer", fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif" }
};

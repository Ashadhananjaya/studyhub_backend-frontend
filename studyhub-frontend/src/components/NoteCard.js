import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Edit2, Trash2, Globe, Lock, Link2, Heart } from "lucide-react";
import toast from "react-hot-toast";
import NoteModal from "./NoteModal";

export default function NoteCard({ note, onDelete, onEdit, onToggle, onLike, onView, readonly }) {
  const isPublic = note.isPublic;
  const [showModal, setShowModal] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * 8,
      y: ((e.clientX - r.left) / r.width - 0.5) * -8,
    });
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/community?note=${note.id}`;
    navigator.clipboard.writeText(url)
      .then(() => toast.success("Link copied!"))
      .catch(() => toast.error("Could not copy."));
  };

  const handleDelete = () => {
    toast(
      (t) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontWeight: "600", fontSize: "0.9rem" }}>Delete this note?</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button 
              onClick={() => { toast.dismiss(t.id); onDelete(note.id); }}
              style={cS.danger}
            >
              Delete
            </button>
            <button 
              onClick={() => toast.dismiss(t.id)}
              style={cS.cancel}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const handleToggle = () => {
    const next = !isPublic;
    toast.promise(Promise.resolve(onToggle(note)), {
      loading: next ? "Making public..." : "Making private...",
      success: next ? "Visible in Community now" : "Note set to private",
      error: "Failed to update."
    });
  };

  const handleLike = () => {
    if (!onLike) return;
    setLikeAnim(true);
    setTimeout(() => setLikeAnim(false), 600);
    onLike(note.id);
  };

  return (
    <>
      <motion.div
        style={s.card}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
      >
        {/* HEADER */}
        <div style={s.header}>
          <div style={s.statusRow}>
            <span 
              style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: isPublic ? "var(--success)" : "var(--accent)" 
              }} 
            />
            <span style={{ ...s.statusLabel, color: isPublic ? "var(--success)" : "var(--accent)" }}>
              {isPublic ? "Public" : "Private"}
            </span>
          </div>
          {!readonly && (
            <div style={s.actions}>
              <motion.button style={s.iconAction} onClick={() => onEdit(note)}
                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Edit2 size={13} />
              </motion.button>
              <motion.button style={{ ...s.iconAction, color: "var(--danger)" }}
                onClick={handleDelete} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Trash2 size={13} />
              </motion.button>
            </div>
          )}
        </div>

        {/* TITLE */}
        <h3 style={s.title}>{note.title}</h3>

        {/* CONTENT (Clamped to 3 lines) */}
        <div style={s.content}>
          <ReactMarkdown>{note.content}</ReactMarkdown>
        </div>

        {/* VIEW BUTTON */}
        <motion.button 
          style={s.viewBtn} 
          whileHover={{ background: "rgba(99, 102, 241, 0.15)", borderColor: "var(--accent)" }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onView(note)}
        >
          View Note
        </motion.button>

        {/* FOOTER */}
        <div style={s.footer}>
          <span style={s.date}>
            {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ""}
          </span>

          <div style={s.footerRight}>
            <motion.button style={s.likeBtn} onClick={handleLike}
              animate={likeAnim ? { scale: [1, 1.4, 0.9, 1] } : {}}>
              <Heart size={14} fill={likeAnim || note.likes > 0 ? "var(--danger)" : "none"} 
                color={likeAnim || note.likes > 0 ? "var(--danger)" : "var(--text-dim)"} />
              <span style={s.likeCount}>{note.likes || 0}</span>
            </motion.button>

            {isPublic && (
              <motion.button style={s.iconBtn} onClick={handleCopyLink} title="Copy Link">
                <Link2 size={13} color="var(--text-dim)" />
              </motion.button>
            )}

            {!readonly && (
              <motion.button
                style={{ 
                  ...s.toggleBtn, 
                  background: isPublic ? "var(--success-dim)" : "var(--accent-dim)", 
                  color: isPublic ? "var(--success)" : "var(--accent-light)" 
                }}
                onClick={handleToggle}
              >
                {isPublic ? <Lock size={11} /> : <Globe size={11} />}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {showModal && <NoteModal note={note} onClose={() => setShowModal(false)} />}
    </>
  );
}

const cS = {
  danger: { background: "var(--danger)", color: "white", border: "none", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "0.82rem" },
  cancel: { background: "transparent", color: "var(--text)", border: "1px solid var(--border)", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "0.82rem" }
};

const s = {
  card: { 
    background: "var(--panel)", 
    border: "1px solid var(--border)", 
    borderRadius: "20px", 
    padding: "24px", 
    display: "flex", 
    flexDirection: "column", 
    height: "320px", // Fixed height for perfect grid alignment
    justifyContent: "space-between",
    transition: "all 0.3s ease",
    position: "relative"
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" },
  statusRow: { display: "flex", alignItems: "center", gap: "8px" },
  statusLabel: { fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" },
  actions: { display: "flex", gap: "4px" },
  iconAction: { background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", padding: "4px" },
  
  title: { 
    fontFamily: "'DM Serif Display', serif", 
    fontSize: "1.25rem", 
    color: "var(--text)", 
    margin: "0 0 10px 0",
    lineHeight: 1.3 
  },
  content: { 
    color: "var(--text-muted)", 
    fontSize: "0.875rem", 
    lineHeight: 1.6, 
    flexGrow: 1,
    display: "-webkit-box",
    WebkitLineClamp: 3, 
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    marginBottom: "16px"
  },
  viewBtn: {
    width: "100%",
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    background: "rgba(255,255,255,0.03)",
    color: "var(--text)",
    cursor: "pointer",
    fontSize: "0.85rem",
    fontWeight: "600",
    transition: "all 0.2s",
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: "16px"
  },
  footer: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    borderTop: "1px solid var(--border)", 
    paddingTop: "12px" 
  },
  date: { fontSize: "0.72rem", color: "var(--text-dim)" },
  footerRight: { display: "flex", alignItems: "center", gap: "10px" },
  likeBtn: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" },
  likeCount: { fontSize: "0.8rem", color: "var(--text-muted)" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" },
  toggleBtn: { border: "none", padding: "6px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center" }
};
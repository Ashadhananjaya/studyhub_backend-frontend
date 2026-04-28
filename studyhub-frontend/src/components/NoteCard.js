import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Edit2, Trash2, Globe, Lock, Link2, Heart } from "lucide-react";
import toast from "react-hot-toast";

export default function NoteCard({ note, onDelete, onEdit, onToggle, onLike, onView, readonly }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const isPublic = note.isPublic;
  const isLiked = note.likedByUser; 

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientY - r.top) / r.height - 0.5) * 8,
      y: ((e.clientX - r.left) / r.width - 0.5) * -8,
    });
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/community?note=${note.id}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Copied!"));
  };

  const isLong = note.content && note.content.length > 120;

  return (
    <motion.div
      style={s.card}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      whileHover={{ y: -5 }}
    >
      <div style={s.header}>
        <div style={s.statusRow}>
          <span style={{ ...s.dot, backgroundColor: isPublic ? "#10b981" : "#6366f1" }} />
          <span style={{ ...s.statusLabel, color: isPublic ? "#10b981" : "#6366f1" }}>{isPublic ? "Public" : "Private"}</span>
        </div>
        {!readonly && (
          <div style={s.actions}>
            <button style={s.iconAction} onClick={() => onEdit(note)}><Edit2 size={13} /></button>
            <button style={{ ...s.iconAction, color: "#ef4444" }} onClick={() => onDelete(note.id)}><Trash2 size={13} /></button>
          </div>
        )}
      </div>

      <h3 style={s.title}>{note.title}</h3>

      <div style={s.contentWrapper}>
        <div style={s.contentMain}><ReactMarkdown>{note.content}</ReactMarkdown></div>
        {isLong && <button style={s.readMore} onClick={onView}>Read more →</button>}
      </div>

      <motion.button style={s.viewBtn} whileHover={{ background: "rgba(255,255,255,0.08)" }} onClick={onView}>View Note</motion.button>

      <div style={s.footer}>
        <span style={s.date}>{new Date(note.createdAt).toLocaleDateString()}</span>
        <div style={s.footerRight}>
          <motion.button style={s.likeBtn} onClick={() => onLike(note.id)} whileTap={{ scale: 0.8 }}>
            <Heart size={14} fill={isLiked ? "#ef4444" : "none"} color={isLiked ? "#ef4444" : "#94a3b8"} />
            <span style={s.likeCount}>{note.likes || 0}</span>
          </motion.button>
          {isPublic && <button style={s.iconBtn} onClick={handleCopyLink}><Link2 size={13} /></button>}
          <button style={s.toggleBtn} onClick={() => onToggle(note)}>{isPublic ? <Lock size={12} /> : <Globe size={12} />}</button>
        </div>
      </div>
    </motion.div>
  );
}

const s = {
  card: { background: "#12141c", border: "1px solid #1e293b", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", height: "350px", justifyContent: "space-between" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "12px" },
  statusRow: { display: "flex", alignItems: "center", gap: "8px" },
  dot: { width: 8, height: 8, borderRadius: "50%" },
  statusLabel: { fontSize: "0.65rem", fontWeight: "800", textTransform: "uppercase" },
  actions: { display: "flex", gap: "8px" },
  iconAction: { background: "none", border: "none", color: "#64748b", cursor: "pointer" },
  title: { fontSize: "1.25rem", color: "#f8fafc", margin: "0 0 10px 0", fontWeight: "600" },
  contentWrapper: { flexGrow: 1, overflow: "hidden", display: "flex", flexDirection: "column" },
  contentMain: { color: "#94a3b8", fontSize: "0.875rem", lineHeight: "1.6", display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical", overflow: "hidden" },
  readMore: { color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", background: "none", border: "none", cursor: "pointer", textAlign: "left", marginTop: "4px" },
  viewBtn: { width: "100%", padding: "10px", borderRadius: "12px", border: "1px solid #1e293b", background: "rgba(255,255,255,0.03)", color: "#f8fafc", cursor: "pointer", fontSize: "0.85rem", fontWeight: "600", marginBottom: "12px" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1e293b", paddingTop: "12px" },
  date: { fontSize: "0.75rem", color: "#64748b" },
  footerRight: { display: "flex", alignItems: "center", gap: "10px" },
  likeBtn: { background: "none", border: "none", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" },
  likeCount: { color: "#94a3b8", fontSize: "0.8rem" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", color: "#64748b" },
  toggleBtn: { background: "#1e293b", border: "none", color: "#94a3b8", padding: "6px", borderRadius: "8px", cursor: "pointer" }
};
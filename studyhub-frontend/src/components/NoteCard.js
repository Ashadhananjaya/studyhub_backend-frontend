import React, { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Edit2, Trash2, Globe, Lock, Link2, Heart } from "lucide-react";
import toast from "react-hot-toast";
import NoteModal from "./NoteModal";

const PREVIEW_LENGTH = 180;

export default function NoteCard({ note, onDelete, onEdit, onToggle, onLike, readonly }) {
  const isPublic = note.isPublic;
  const [showModal, setShowModal] = useState(false);
  const [likeAnim, setLikeAnim]   = useState(false);
  const [tilt, setTilt]           = useState({ x: 0, y: 0 });

  const isLong  = note.content && note.content.length > PREVIEW_LENGTH;
  const preview = isLong ? note.content.slice(0, PREVIEW_LENGTH) + "..." : note.content;

  const handleMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x:  ((e.clientY - r.top)  / r.height - 0.5) * 8,
      y:  ((e.clientX - r.left) / r.width  - 0.5) * -8,
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
            <button onClick={() => { toast.dismiss(t.id); onDelete(note.id); }}
              style={cS.danger}>Delete</button>
            <button onClick={() => toast.dismiss(t.id)}
              style={cS.cancel}>Cancel</button>
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
        whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}
      >
        {/* HEADER */}
        <div style={s.header}>
          <div style={s.statusRow}>
            <span
              className="pulse-dot"
              style={{ backgroundColor: isPublic ? "var(--success)" : "var(--accent)" }}
            />
            <span style={{ ...s.statusLabel, color: isPublic ? "var(--success)" : "var(--accent)" }}>
              {isPublic ? "Public" : "Private"}
            </span>
          </div>
          {!readonly && (
            <div style={s.actions}>
              <motion.button style={s.iconAction} onClick={() => onEdit(note)}
                whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} title="Edit">
                <Edit2 size={13} />
              </motion.button>
              <motion.button style={{ ...s.iconAction, color: "var(--danger)" }}
                onClick={handleDelete} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} title="Delete">
                <Trash2 size={13} />
              </motion.button>
            </div>
          )}
        </div>

        {/* TITLE */}
        <h3 style={s.title}>{note.title}</h3>

        {/* CONTENT */}
        <div style={s.content}><ReactMarkdown>{preview}</ReactMarkdown></div>

        {/* READ MORE */}
        {isLong && (
          <button style={s.readMore} onClick={() => setShowModal(true)}>Read more →</button>
        )}

        {/* FOOTER */}
        <div style={s.footer}>
          <span style={s.date}>
            {note.createdAt
              ? new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : ""}
          </span>

          <div style={s.footerRight}>
            <motion.button style={s.likeBtn} onClick={handleLike}
              animate={likeAnim ? { scale: [1, 1.5, 0.85, 1] } : {}}
              transition={{ duration: 0.4 }}>
              <Heart size={14}
                fill={likeAnim ? "var(--danger)" : "none"}
                color={likeAnim ? "var(--danger)" : "var(--text-muted)"} />
              <span style={s.likeCount}>{note.likes || 0}</span>
            </motion.button>

            {isPublic && (
              <motion.button style={s.iconBtn} onClick={handleCopyLink}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} title="Copy link">
                <Link2 size={13} color="var(--text-muted)" />
              </motion.button>
            )}

            {!readonly && (
              <motion.button
                style={{ ...s.toggleBtn, background: isPublic ? "var(--success-dim)" : "var(--accent-dim)", color: isPublic ? "var(--success)" : "var(--accent)" }}
                onClick={handleToggle} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                {isPublic ? <><Lock size={11} /> Private</> : <><Globe size={11} /> Public</>}
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
  danger: { background: "var(--danger)", color: "white", border: "none", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif" },
  cancel: { background: "transparent", color: "var(--text)", border: "1px solid var(--border)", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif" }
};

const s = {
  card: { background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statusRow: { display: "flex", alignItems: "center", gap: "8px" },
  statusLabel: { fontSize: "0.7rem", fontWeight: "700", letterSpacing: "0.5px", textTransform: "uppercase" },
  actions: { display: "flex", gap: "2px" },
  iconAction: { background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "6px", borderRadius: "8px", display: "flex", alignItems: "center" },
  title: { fontFamily: "'DM Serif Display', serif", fontSize: "1.15rem", color: "var(--text)", lineHeight: 1.3 },
  content: { color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.7, minHeight: "50px" },
  readMore: { background: "none", border: "none", color: "var(--accent-light)", cursor: "pointer", fontSize: "0.82rem", fontWeight: "600", padding: 0, alignSelf: "flex-start", fontFamily: "'DM Sans', sans-serif" },
  footer: { paddingTop: "14px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  date: { fontSize: "0.72rem", color: "var(--text-dim)" },
  footerRight: { display: "flex", alignItems: "center", gap: "4px" },
  likeBtn: { background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", padding: "5px 8px", borderRadius: "8px", fontFamily: "'DM Sans', sans-serif" },
  likeCount: { fontSize: "0.78rem", color: "var(--text-muted)" },
  iconBtn: { background: "none", border: "none", cursor: "pointer", padding: "6px", borderRadius: "8px", display: "flex", alignItems: "center" },
  toggleBtn: { display: "flex", alignItems: "center", gap: "5px", border: "none", padding: "5px 10px", borderRadius: "8px", fontSize: "0.7rem", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }
};

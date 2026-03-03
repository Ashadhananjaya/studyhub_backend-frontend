import React from "react";

export default function NoteCard({ note, onDelete, onEdit, onToggle }) {
  const isPublic = note.public; // 🔥 Changed to .public

  return (
    <div style={styles.card} className="fade-in">
      <div style={styles.header}>
        <div style={styles.statusGroup}>
          <div style={{...styles.dot, backgroundColor: isPublic ? '#10b981' : 'var(--accent)'}} />
          <span style={styles.statusText}>{isPublic ? "PUBLIC" : "PRIVATE"}</span>
        </div>
        <div style={styles.actions}>
          <button style={styles.textAction} onClick={() => onEdit(note)}>Edit</button>
          <button style={{...styles.textAction, color: '#f87171'}} onClick={() => onDelete(note.id)}>Delete</button>
        </div>
      </div>

      <h3 style={styles.title}>{note.title}</h3>
      <p style={styles.content}>{note.content}</p>

      <div style={styles.footer}>
        <span style={styles.date}>{new Date(note.createdAt).toLocaleDateString()}</span>
        <button style={styles.visibilityBtn} onClick={() => onToggle(note)}>
          {isPublic ? "Set Private" : "Set Public"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { 
    background: "var(--panel)", border: "1px solid var(--border)", 
    padding: "28px", borderRadius: "var(--radius)", 
    display: "flex", flexDirection: "column", gap: "15px",
    boxShadow: "0 4px 25px rgba(0,0,0,0.03)"
  },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statusGroup: { display: "flex", alignItems: "center", gap: "8px" },
  dot: { width: "8px", height: "8px", borderRadius: "50%" },
  statusText: { fontSize: "0.7rem", fontWeight: "800", opacity: 0.7, letterSpacing: "1px" },
  actions: { display: "flex", gap: "15px" },
  textAction: { background: "none", border: "none", color: "var(--text)", cursor: "pointer", fontSize: "0.8rem", fontWeight: "700", opacity: 0.6 },
  title: { margin: "5px 0", fontSize: "1.2rem", fontWeight: "800", color: "var(--text)" },
  content: { color: "var(--text)", opacity: 0.75, fontSize: "0.95rem", lineHeight: "1.7", margin: 0, height: "80px", overflow: "hidden" },
  footer: { marginTop: "10px", paddingTop: "18px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  date: { fontSize: "0.75rem", color: "var(--text)", opacity: 0.4 },
  visibilityBtn: { background: "rgba(99, 102, 241, 0.1)", color: "var(--accent)", border: "none", padding: "8px 16px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "800", cursor: "pointer" }
};
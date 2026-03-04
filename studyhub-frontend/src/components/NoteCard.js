import React from "react";
import ReactMarkdown from 'react-markdown';

export default function NoteCard({ note, onDelete, onEdit, onToggle, onLike, readonly }) {
  const isPublic = note.isPublic; 
  

  return (
    <div style={styles.card} className="fade-in">
      <div style={styles.header}>
        <div style={styles.statusGroup}>
          <div style={{...styles.dot, backgroundColor: isPublic ? '#10b981' : '#6366f1'}} />
          <span style={styles.statusText}>{isPublic ? "PUBLIC" : "PRIVATE"}</span>
        </div>
        {!readonly && (
          <div style={styles.actions}>
            <button style={styles.textAction} onClick={() => onEdit(note)}>Edit</button>
            <button style={{...styles.textAction, color: '#f87171'}} onClick={() => onDelete(note.id)}>Delete</button>
          </div>
        )}
      </div>

      <h3 style={styles.title}>{note.title}</h3>
      
      <div style={styles.content}>
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>

      <div style={styles.footer}>
        <span style={styles.date}>{new Date(note.createdAt).toLocaleDateString()}</span>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{note.likes || 0}</span>
            <button onClick={() => onLike(note.id)} style={styles.likeBtn}>❤️</button>
          </div>
          
          {!readonly && (
            <button style={styles.visibilityBtn} onClick={() => onToggle(note)}>
              {isPublic ? "Set Private" : "Set Public"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { background: "var(--panel)", border: "1px solid var(--border)", padding: "28px", borderRadius: "20px", display: "flex", flexDirection: "column", gap: "15px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  statusGroup: { display: "flex", alignItems: "center", gap: "8px" },
  dot: { width: "8px", height: "8px", borderRadius: "50%" },
  statusText: { fontSize: "0.7rem", fontWeight: "800", opacity: 0.7, letterSpacing: "1px" },
  actions: { display: "flex", gap: "15px" },
  textAction: { background: "none", border: "none", color: "var(--text)", cursor: "pointer", fontSize: "0.8rem", fontWeight: "700", opacity: 0.6 },
  title: { margin: "5px 0", fontSize: "1.2rem", fontWeight: "800", color: "var(--text)" },
  content: { color: "var(--text)", opacity: 0.8, fontSize: "0.95rem", lineHeight: "1.6", minHeight: "60px" },
  footer: { marginTop: "10px", paddingTop: "18px", borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" },
  date: { fontSize: "0.75rem", color: "var(--text)", opacity: 0.4 },
  visibilityBtn: { background: "rgba(99, 102, 241, 0.1)", color: "#6366f1", border: "none", padding: "6px 12px", borderRadius: "10px", fontSize: "0.7rem", fontWeight: "800", cursor: "pointer" },
  likeBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "1rem", padding: 0 }
};
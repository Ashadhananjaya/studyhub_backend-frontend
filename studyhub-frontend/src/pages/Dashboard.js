import React, { useState, useEffect } from "react";
import { noteService } from "../services/noteService";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const res = await noteService.getMyNotes();
      setNotes(res.data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const data = { title, content, isPublic };
    
    editingId ? await noteService.updateNote(editingId, data) : await noteService.createNote(data);
    
    setTitle(""); setContent(""); setIsPublic(false); setEditingId(null);
    fetchNotes();
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main style={styles.container}>
        <div style={styles.editorPanel} className="fade-in">
          <form onSubmit={handleSave}>
            <input 
              style={styles.inputTitle} 
              placeholder="Give your note a title..." 
              value={title} onChange={e => setTitle(e.target.value)} 
            />
            <textarea 
              style={styles.inputText} 
              placeholder="What are you thinking?" 
              value={content} onChange={e => setContent(e.target.value)} 
            />
            
            <div style={styles.editorFooter}>
              <div style={styles.toggleRow}>
                <button 
                  type="button" 
                  onClick={() => setIsPublic(false)}
                  style={{...styles.toggleBtn, background: !isPublic ? 'var(--accent)' : 'transparent', color: !isPublic ? 'white' : 'var(--text)'}}
                >
                  Private
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsPublic(true)}
                  style={{...styles.toggleBtn, background: isPublic ? 'var(--accent)' : 'transparent', color: isPublic ? 'white' : 'var(--text)'}}
                >
                  Public
                </button>
              </div>
              <button type="submit" style={styles.saveBtn}>
                {editingId ? "Update Note" : "Save Note"}
              </button>
            </div>
          </form>
        </div>

        <div style={styles.grid}>
          {notes.map(n => (
            <NoteCard 
              key={n.id} note={n} 
              onEdit={note => { 
                setTitle(note.title); 
                setContent(note.content); 
                setIsPublic(note.public); // 🔥 Changed to .public
                setEditingId(note.id); 
                window.scrollTo({top:0, behavior:'smooth'}); 
              }}
              onDelete={id => noteService.deleteNote(id).then(fetchNotes)}
              onToggle={note => noteService.updateNote(note.id, {...note, isPublic: !note.public}).then(fetchNotes)} // 🔥 Changed to .public
            />
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" },
  editorPanel: { background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "35px", marginBottom: "50px" },
  inputTitle: { width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--border)", color: "var(--text)", fontSize: "1.6rem", fontWeight: "700", marginBottom: "20px", outline: "none", paddingBottom: "12px" },
  inputText: { width: "100%", background: "none", border: "none", color: "var(--text)", fontSize: "1.05rem", minHeight: "220px", outline: "none", resize: "none", lineHeight: "1.8" },
  editorFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "25px" },
  toggleRow: { display: "flex", background: "rgba(0,0,0,0.04)", borderRadius: "10px", padding: "4px" },
  toggleBtn: { border: "none", padding: "8px 18px", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem", fontWeight: "700", transition: "0.2s" },
  saveBtn: { background: "var(--accent)", color: "white", padding: "12px 35px", borderRadius: "14px", border: "none", fontWeight: "800", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "28px" }
};
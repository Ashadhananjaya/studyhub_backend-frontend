import React, { useState, useEffect } from "react";
import { noteService } from "../services/noteService";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    try {
      const res = await noteService.getMyNotes();
      setNotes(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const data = { title, content };
    try {
      editingId ? await noteService.updateNote(editingId, data) : await noteService.createNote(data);
      setTitle(""); setContent(""); setEditingId(null);
      fetchNotes();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <main style={styles.container}>
        <div style={styles.editorPanel}>
          <form onSubmit={handleSave}>
            <input style={styles.inputTitle} placeholder="Title..." value={title} onChange={e => setTitle(e.target.value)} />
            <textarea style={styles.inputText} placeholder="Content..." value={content} onChange={e => setContent(e.target.value)} />
            <button type="submit" style={styles.saveBtn}>{editingId ? "Update" : "Save Note"}</button>
          </form>
        </div>
        <div style={styles.grid}>
          {notes.map(n => (
            <NoteCard
  key={n.id}
  note={n}
  onEdit={note => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  }}
  onDelete={id => noteService.deleteNote(id).then(fetchNotes)}
  onToggle={note =>
    noteService.updateNote(note.id, {
      title: note.title,
      content: note.content,
      isPublic: !note.isPublic
    }).then(fetchNotes)
  }
/>
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { maxWidth: "1200px", margin: "0 auto", padding: "40px" },
  editorPanel: { background: "var(--panel)", padding: "30px", borderRadius: "15px", marginBottom: "30px", border: "1px solid var(--border)" },
  inputTitle: { width: "100%", background: "none", border: "none", color: "var(--text)", fontSize: "1.5rem", marginBottom: "15px", outline: "none" },
  inputText: { width: "100%", background: "none", border: "none", color: "var(--text)", minHeight: "100px", outline: "none", resize: "none" },
  saveBtn: { background: "#6366f1", color: "white", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }
};
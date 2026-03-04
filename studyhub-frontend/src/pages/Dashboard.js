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
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await noteService.getMyNotes();
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const data = {
      title,
      content,
      isPublic
    };

    try {

      if (editingId) {
        await noteService.updateNote(editingId, data);
      } else {
        await noteService.createNote(data);
      }

      setTitle("");
      setContent("");
      setIsPublic(false);
      setEditingId(null);

      fetchNotes();

    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>

      <Navbar />

      <main style={styles.container}>

        {/* NOTE EDITOR */}
        <div style={styles.editorPanel}>
          <form onSubmit={handleSave}>

            <input
              style={styles.inputTitle}
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              style={styles.inputText}
              placeholder="Content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {/* PUBLIC PRIVATE TOGGLE */}
            <div style={styles.toggleRow}>

              <button
                type="button"
                onClick={() => setIsPublic(false)}
                style={{
                  ...styles.toggleBtn,
                  background: !isPublic ? "#6366f1" : "transparent",
                  color: !isPublic ? "white" : "var(--text)"
                }}
              >
                Private
              </button>

              <button
                type="button"
                onClick={() => setIsPublic(true)}
                style={{
                  ...styles.toggleBtn,
                  background: isPublic ? "#10b981" : "transparent",
                  color: isPublic ? "white" : "var(--text)"
                }}
              >
                Public
              </button>

            </div>

            <button type="submit" style={styles.saveBtn}>
              {editingId ? "Update Note" : "Save Note"}
            </button>

          </form>
        </div>


        {/* SEARCH BAR */}
        <input
          style={styles.search}
          placeholder="Search your notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />


        {/* NOTES GRID */}
        <div style={styles.grid}>
          {filteredNotes.map(n => (
            <NoteCard
              key={n.id}
              note={n}

              onEdit={(note) => {
                setTitle(note.title);
                setContent(note.content);
                setIsPublic(note.isPublic);
                setEditingId(note.id);
              }}

              onDelete={(id) =>
                noteService.deleteNote(id).then(fetchNotes)
              }

              onToggle={(note) =>
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

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px"
  },

  editorPanel: {
    background: "var(--panel)",
    padding: "30px",
    borderRadius: "15px",
    marginBottom: "25px",
    border: "1px solid var(--border)"
  },

  inputTitle: {
    width: "100%",
    background: "none",
    border: "none",
    color: "var(--text)",
    fontSize: "1.5rem",
    marginBottom: "15px",
    outline: "none"
  },

  inputText: {
    width: "100%",
    background: "none",
    border: "none",
    color: "var(--text)",
    minHeight: "100px",
    outline: "none",
    resize: "none",
    marginBottom: "15px"
  },

  toggleRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },

  toggleBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    cursor: "pointer"
  },

  saveBtn: {
  background: "#6366f1",
  color: "white",
  padding: "10px 20px",
  borderRadius: "10px",
  border: "none",
  cursor: "pointer",
  float: "right"
},

  search: {
    width: "100%",
    padding: "12px",
    marginBottom: "25px",
    borderRadius: "10px",
    border: "1px solid var(--border)"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  }

};
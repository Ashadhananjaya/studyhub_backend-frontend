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
      const sorted = res.data.sort((a, b) => a.id - b.id);
      setNotes(sorted);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  // LIKE BUTTON
  const handleLike = async (id) => {
    try {
      await noteService.likeNote(id);
      fetchNotes();
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  // SAVE NOTE
  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const data = {
      title: title,
      content: content,
      isPublic: isPublic   // This now correctly maps because of @JsonProperty in backend
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
      console.error("Save Error:", err.response?.data || err.message);
    }
  };

  // TOGGLE PUBLIC / PRIVATE
  const handleToggle = async (note) => {
    try {
      await noteService.updateNote(note.id, {
        title: note.title,
        content: note.content,
        isPublic: !note.isPublic   // FIX: flip the boolean
      });
      fetchNotes();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  // SEARCH FILTER
  const filteredNotes = notes.filter((n) =>
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
              placeholder="Give your note a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              style={styles.inputText}
              placeholder="Write your note here... (Markdown is supported)"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div style={styles.editorFooter}>

              {/* PUBLIC / PRIVATE TOGGLE */}
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
                  🔒 Private
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
                  🌍 Public
                </button>
              </div>

              {/* VISIBILITY LABEL */}
              <span style={styles.visibilityLabel}>
                {isPublic
                  ? "✅ This note will appear in Community"
                  : "🔒 Only you can see this note"}
              </span>

              <button type="submit" style={styles.saveBtn}>
                {editingId ? "Update Note" : "Save Note"}
              </button>

            </div>

          </form>
        </div>

        {/* SEARCH BAR */}
        <input
          style={styles.searchBar}
          placeholder="Search your notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* NOTES COUNT */}
        <div style={styles.notesInfo}>
          <span>{filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}</span>
          <span style={{ opacity: 0.5 }}>
            {notes.filter(n => n.isPublic).length} public •{" "}
            {notes.filter(n => !n.isPublic).length} private
          </span>
        </div>

        {/* NOTES GRID */}
        <div style={styles.grid}>
          {filteredNotes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onLike={handleLike}
              onEdit={(note) => {
                setTitle(note.title);
                setContent(note.content);
                setIsPublic(note.isPublic);
                setEditingId(note.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onDelete={(id) =>
                noteService.deleteNote(id).then(fetchNotes)
              }
              onToggle={handleToggle}
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
    padding: "40px 20px"
  },
  editorPanel: {
    background: "var(--panel)",
    border: "1px solid var(--border)",
    borderRadius: "20px",
    padding: "35px",
    marginBottom: "30px"
  },
  inputTitle: {
    width: "100%",
    background: "none",
    border: "none",
    borderBottom: "1px solid var(--border)",
    color: "var(--text)",
    fontSize: "1.6rem",
    fontWeight: "700",
    marginBottom: "20px",
    outline: "none",
    paddingBottom: "12px",
    boxSizing: "border-box"
  },
  inputText: {
    width: "100%",
    background: "none",
    border: "none",
    color: "var(--text)",
    fontSize: "1rem",
    minHeight: "180px",
    outline: "none",
    resize: "none",
    lineHeight: "1.8",
    boxSizing: "border-box"
  },
  editorFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid var(--border)",
    paddingTop: "20px",
    flexWrap: "wrap",
    gap: "12px"
  },
  toggleRow: {
    display: "flex",
    background: "rgba(0,0,0,0.05)",
    borderRadius: "10px",
    padding: "4px"
  },
  toggleBtn: {
    border: "none",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "700",
    transition: "all 0.2s ease"
  },
  visibilityLabel: {
    fontSize: "0.8rem",
    opacity: 0.7,
    fontStyle: "italic"
  },
  saveBtn: {
    background: "#6366f1",
    color: "white",
    padding: "12px 30px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "800",
    cursor: "pointer"
  },
  searchBar: {
    width: "100%",
    background: "var(--panel)",
    border: "1px solid var(--border)",
    padding: "14px 20px",
    borderRadius: "12px",
    color: "var(--text)",
    marginBottom: "15px",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box"
  },
  notesInfo: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "25px",
    fontSize: "0.85rem",
    opacity: 0.7
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "30px"
  }
};

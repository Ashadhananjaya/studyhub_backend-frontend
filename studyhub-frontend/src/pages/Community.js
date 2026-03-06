import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { noteService } from "../services/noteService";
import NoteCard from "../components/NoteCard";

export default function Community() {

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await noteService.getPublicNotes();
      // Sort newest first
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotes(sorted);
    } catch (err) {
      console.error("Error fetching public notes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Like a note and refresh
  const handleLike = async (id) => {
    try {
      await noteService.likeNote(id);
      fetchNotes();
    } catch (err) {
      console.error("Like error:", err);
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

        <div style={styles.pageHeader}>
          <h2 style={styles.heading}>🌍 Community Notes</h2>
          <p style={styles.subheading}>
            Explore public notes shared by all StudyHub users
          </p>
        </div>

        <input
          style={styles.search}
          placeholder="Search community notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <div style={styles.empty}>Loading notes...</div>
        ) : filteredNotes.length === 0 ? (
          <div style={styles.empty}>
            {search ? "No notes match your search." : "No public notes yet. Be the first to share!"}
          </div>
        ) : (
          <>
            <div style={styles.count}>
              {filteredNotes.length} public note{filteredNotes.length !== 1 ? 's' : ''}
            </div>
            <div style={styles.grid}>
              {filteredNotes.map(n => (
                <NoteCard
                  key={n.id}
                  note={n}
                  onLike={handleLike}
                  readonly
                />
              ))}
            </div>
          </>
        )}

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
  pageHeader: {
    marginBottom: "30px"
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "800",
    margin: "0 0 8px 0"
  },
  subheading: {
    opacity: 0.6,
    margin: 0
  },
  search: {
    width: "100%",
    padding: "14px 20px",
    margin: "0 0 20px 0",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    background: "var(--panel)",
    color: "var(--text)",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box"
  },
  count: {
    fontSize: "0.85rem",
    opacity: 0.6,
    marginBottom: "20px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  },
  empty: {
    textAlign: "center",
    padding: "80px 20px",
    opacity: 0.5,
    fontSize: "1.1rem"
  }
};

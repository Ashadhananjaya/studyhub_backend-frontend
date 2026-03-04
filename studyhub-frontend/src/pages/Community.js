import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { noteService } from "../services/noteService";
import NoteCard from "../components/NoteCard";

export default function Community() {

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await noteService.getPublicNotes();
      setNotes(res.data);
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

        <h2>Community Notes</h2>

        <input
          style={styles.search}
          placeholder="Search public notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div style={styles.grid}>
          {filteredNotes.map(n => (
            <NoteCard key={n.id} note={n} readonly />
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

  search: {
    width: "100%",
    padding: "12px",
    margin: "20px 0",
    borderRadius: "10px",
    border: "1px solid var(--border)"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px"
  }

};
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { noteService } from "../services/noteService";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import toast from "react-hot-toast";
import { PenLine, Search, Globe, Lock, StickyNote } from "lucide-react";

function useDebounce(value, delay) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

export default function Dashboard() {
  const [notes, setNotes]       = useState([]);
  const [title, setTitle]       = useState("");
  const [content, setContent]   = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await noteService.getMyNotes();
      setNotes(res.data.sort((a, b) => a.id - b.id));
    } catch (err) {
      toast.error("Could not load notes.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try { await noteService.likeNote(id); fetchNotes(); }
    catch { toast.error("Could not like note."); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title is required."); return; }

    const data = { title, content, isPublic };
    const promise = editingId
      ? noteService.updateNote(editingId, data)
      : noteService.createNote(data);

    toast.promise(promise, {
      loading: editingId ? "Updating..." : "Saving...",
      success: () => {
        setTitle(""); setContent(""); setIsPublic(false); setEditingId(null);
        fetchNotes();
        return editingId ? "Note updated" : "Note saved";
      },
      error: "Something went wrong."
    });
  };

  const handleToggle = useCallback(async (note) => {
    await noteService.updateNote(note.id, { title: note.title, content: note.content, isPublic: !note.isPublic });
    fetchNotes();
  }, []);

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    n.content.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const publicCount  = notes.filter(n => n.isPublic).length;
  const privateCount = notes.filter(n => !n.isPublic).length;

  return (
    <div style={s.page}>
      <Navbar />

      <main style={s.main}>

        {/* ── EDITOR ── */}
        <motion.div
          style={s.editor}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div style={s.editorHeader}>
            <PenLine size={16} color="var(--accent-light)" />
            <span style={s.editorLabel}>
              {editingId ? "Editing note" : "New note"}
            </span>
            {editingId && (
              <button style={s.cancelEdit} onClick={() => {
                setTitle(""); setContent(""); setIsPublic(false); setEditingId(null);
              }}>Cancel</button>
            )}
          </div>

          <form onSubmit={handleSave}>
            <input
              style={s.titleInput}
              placeholder="Give your note a title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              style={s.contentInput}
              placeholder="Write here... Markdown is supported"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div style={s.editorFooter}>
              {/* Toggle */}
              <div style={s.toggleRow}>
                <button type="button"
                  style={{ ...s.toggleBtn, ...(isPublic ? {} : s.toggleActive) }}
                  onClick={() => setIsPublic(false)}>
                  <Lock size={12} /> Private
                </button>
                <button type="button"
                  style={{ ...s.toggleBtn, ...(isPublic ? s.toggleActivePublic : {}) }}
                  onClick={() => setIsPublic(true)}>
                  <Globe size={12} /> Public
                </button>
              </div>

              <span style={s.visHint}>
                {isPublic ? "Will appear in Community" : "Only visible to you"}
              </span>

              <motion.button
                type="submit" style={s.saveBtn}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {editingId ? "Update" : "Save Note"}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* ── STATS ── */}
        <motion.div
          style={s.statsRow}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {[
            { icon: <StickyNote size={14} />, label: "Total",   val: notes.length, color: "var(--accent)" },
            { icon: <Globe size={14} />,      label: "Public",  val: publicCount,  color: "var(--success)" },
            { icon: <Lock size={14} />,       label: "Private", val: privateCount, color: "var(--text-muted)" },
          ].map(({ icon, label, val, color }) => (
            <div key={label} style={s.statCard}>
              <span style={{ ...s.statIcon, color }}>{icon}</span>
              <span style={s.statVal}>{val}</span>
              <span style={s.statLabel}>{label}</span>
            </div>
          ))}
        </motion.div>

        {/* ── SEARCH ── */}
        <div style={s.searchWrapper}>
          <Search size={15} style={s.searchIcon} />
          <input
            style={s.searchInput}
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ── NOTES ── */}
        {loading ? (
          <div style={s.skeletonGrid}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={s.skeleton} className="skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div style={s.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <StickyNote size={32} color="var(--text-dim)" />
            <p>{search ? "No notes match your search." : "No notes yet. Write your first one above."}</p>
          </motion.div>
        ) : (
          <motion.div style={s.grid}>
            <AnimatePresence>
              {filtered.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <NoteCard
                    note={n}
                    onLike={handleLike}
                    onEdit={(note) => {
                      setTitle(note.title); setContent(note.content);
                      setIsPublic(note.isPublic); setEditingId(note.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      toast("Editing note", { duration: 1200 });
                    }}
                    onDelete={(id) => noteService.deleteNote(id).then(fetchNotes)}
                    onToggle={handleToggle}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </main>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "var(--bg)" },
  main: { maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" },

  // Editor
  editor: { background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "20px", padding: "28px", marginBottom: "24px" },
  editorHeader: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" },
  editorLabel: { fontSize: "0.8rem", fontWeight: "600", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", flex: 1 },
  cancelEdit: { background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.82rem", fontFamily: "'DM Sans', sans-serif" },
  titleInput: { width: "100%", background: "none", border: "none", borderBottom: "1px solid var(--border)", color: "var(--text)", fontSize: "1.5rem", fontFamily: "'DM Serif Display', serif", fontWeight: "400", marginBottom: "16px", outline: "none", paddingBottom: "12px", boxSizing: "border-box" },
  contentInput: { width: "100%", background: "none", border: "none", color: "var(--text)", fontSize: "0.95rem", minHeight: "160px", outline: "none", resize: "none", lineHeight: "1.8", boxSizing: "border-box", fontFamily: "'DM Sans', sans-serif" },
  editorFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: "18px", gap: "12px", flexWrap: "wrap" },
  toggleRow: { display: "flex", background: "var(--bg)", borderRadius: "10px", padding: "3px", gap: "2px" },
  toggleBtn: { display: "flex", alignItems: "center", gap: "6px", border: "none", padding: "7px 14px", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "600", cursor: "pointer", background: "transparent", color: "var(--text-muted)", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" },
  toggleActive: { background: "var(--accent-dim)", color: "var(--accent-light)" },
  toggleActivePublic: { background: "var(--success-dim)", color: "var(--success)" },
  visHint: { fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic", flex: 1 },
  saveBtn: { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", borderRadius: "12px", padding: "10px 24px", fontSize: "0.875rem", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },

  // Stats
  statsRow: { display: "flex", gap: "12px", marginBottom: "20px" },
  statCard: { flex: 1, background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "14px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "10px" },
  statIcon: { display: "flex" },
  statVal: { fontSize: "1.2rem", fontWeight: "700", color: "var(--text)", fontFamily: "'DM Serif Display', serif" },
  statLabel: { fontSize: "0.78rem", color: "var(--text-muted)", marginLeft: "auto" },

  // Search
  searchWrapper: { position: "relative", marginBottom: "24px" },
  searchIcon: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", pointerEvents: "none" },
  searchInput: { width: "100%", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px 16px 12px 40px", color: "var(--text)", fontSize: "0.9rem", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" },

  // Grid
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" },
  skeletonGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" },
  skeleton: { height: "220px" },
  empty: { textAlign: "center", padding: "80px 20px", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", fontSize: "0.9rem" }
};

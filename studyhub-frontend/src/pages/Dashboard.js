import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { noteService } from "../services/noteService";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
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
  const [activeNote, setActiveNote] = useState(null);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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

  // SMOOTH OPTIMISTIC LIKE (No Jumps!)
  const handleLike = async (id) => {
    // Update UI immediately
    setNotes(prev => prev.map(n => {
      if (n.id === id) {
        const isCurrentlyLiked = n.likedByUser; // Assuming backend sends this
        return {
          ...n,
          likes: isCurrentlyLiked ? n.likes - 1 : n.likes + 1,
          likedByUser: !isCurrentlyLiked
        };
      }
      return n;
    }));

    try {
      await noteService.likeNote(id);
      // No fetchNotes() here, keep the flow smooth!
    } catch {
      toast.error("Sync failed.");
      fetchNotes(); // Rollback on error
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title is required."); return; }
    const data = { title, content, isPublic };
    const promise = editingId ? noteService.updateNote(editingId, data) : noteService.createNote(data);

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
    await noteService.updateNote(note.id, { ...note, isPublic: !note.isPublic });
    fetchNotes();
  }, []);

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    n.content.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const publicCount = notes.filter(n => n.isPublic).length;
  const privateCount = notes.filter(n => !n.isPublic).length;

  return (
    <div style={s.page}>
      <Navbar />
      <main style={s.main}>
        <motion.div style={s.editor} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div style={s.editorHeader}>
            <PenLine size={16} color="var(--accent-light)" />
            <span style={s.editorLabel}>{editingId ? "Editing note" : "New note"}</span>
            {editingId && <button style={s.cancelEdit} onClick={() => {setTitle(""); setContent(""); setEditingId(null);}}>Cancel</button>}
          </div>
          <form onSubmit={handleSave}>
            <input style={s.titleInput} placeholder="Give your note a title..." value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea style={s.contentInput} placeholder="Write here..." value={content} onChange={(e) => setContent(e.target.value)} />
            <div style={s.editorFooter}>
              <div style={s.toggleRow}>
                <button type="button" style={{ ...s.toggleBtn, ...(!isPublic ? s.toggleActive : {}) }} onClick={() => setIsPublic(false)}><Lock size={12} /> Private</button>
                <button type="button" style={{ ...s.toggleBtn, ...(isPublic ? s.toggleActivePublic : {}) }} onClick={() => setIsPublic(true)}><Globe size={12} /> Public</button>
              </div>
              <span style={s.visHint}>{isPublic ? "Will appear in Community" : "Only visible to you"}</span>
              <motion.button type="submit" style={s.saveBtn} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{editingId ? "Update" : "Save Note"}</motion.button>
            </div>
          </form>
        </motion.div>

        <div style={s.statsRow}>
          {[{ icon: <StickyNote size={14} />, label: "Total", val: notes.length, color: "var(--accent)" },
            { icon: <Globe size={14} />, label: "Public", val: publicCount, color: "var(--success)" },
            { icon: <Lock size={14} />, label: "Private", val: privateCount, color: "var(--text-muted)" }
          ].map(({ icon, label, val, color }) => (
            <div key={label} style={s.statCard}>
              <span style={{ ...s.statIcon, color }}>{icon}</span>
              <span style={s.statVal}>{val}</span>
              <span style={s.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        <div style={s.searchWrapper}>
          <Search size={15} style={s.searchIcon} />
          <input style={s.searchInput} placeholder="Search notes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {loading ? (
          <div style={s.skeletonGrid}>{[1,2,3].map(i => <div key={i} style={s.skeleton} className="skeleton" />)}</div>
        ) : (
          <motion.div style={s.grid} layout>
            <AnimatePresence mode="popLayout">
              {filtered.map((n) => (
                <motion.div key={n.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}>
                  <NoteCard note={n} onView={() => setActiveNote(n)} onLike={handleLike} onDelete={(id) => noteService.deleteNote(id).then(fetchNotes)} onToggle={handleToggle} onEdit={(note) => { setTitle(note.title); setContent(note.content); setIsPublic(note.isPublic); setEditingId(note.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
      {activeNote && <NoteModal note={activeNote} onClose={() => setActiveNote(null)} />}
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "#0a0c14" },
  main: { maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" },
  editor: { background: "#12141c", border: "1px solid #1e293b", borderRadius: "20px", padding: "28px", marginBottom: "24px" },
  editorHeader: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" },
  editorLabel: { fontSize: "0.8rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", flex: 1 },
  cancelEdit: { background: "none", border: "none", color: "#64748b", cursor: "pointer" },
  titleInput: { width: "100%", background: "none", border: "none", borderBottom: "1px solid #1e293b", color: "#f8fafc", fontSize: "1.5rem", marginBottom: "16px", outline: "none", paddingBottom: "12px" },
  contentInput: { width: "100%", background: "none", border: "none", color: "#94a3b8", fontSize: "0.95rem", minHeight: "120px", outline: "none", resize: "none" },
  editorFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #1e293b", paddingTop: "18px", gap: "12px" },
  toggleRow: { display: "flex", background: "#0a0c14", borderRadius: "10px", padding: "3px" },
  toggleBtn: { display: "flex", alignItems: "center", gap: "6px", border: "none", padding: "7px 14px", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", background: "transparent", color: "#64748b" },
  toggleActive: { background: "rgba(99,102,241,0.1)", color: "#818cf8" },
  toggleActivePublic: { background: "rgba(16,185,129,0.1)", color: "#10b981" },
  saveBtn: { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "white", border: "none", borderRadius: "12px", padding: "10px 24px", fontWeight: "600", cursor: "pointer" },
  statsRow: { display: "flex", gap: "12px", marginBottom: "20px" },
  statCard: { flex: 1, background: "#12141c", border: "1px solid #1e293b", borderRadius: "14px", padding: "16px", display: "flex", alignItems: "center", gap: "10px" },
  statVal: { fontSize: "1.2rem", fontWeight: "700", color: "#f8fafc" },
  statLabel: { fontSize: "0.78rem", color: "#64748b", marginLeft: "auto" },
  searchWrapper: { position: "relative", marginBottom: "24px" },
  searchIcon: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#475569" },
  searchInput: { width: "100%", background: "#12141c", border: "1px solid #1e293b", borderRadius: "12px", padding: "12px 40px", color: "#f8fafc", outline: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px", alignItems: "stretch" },
  skeletonGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" },
  skeleton: { height: "340px", background: "#12141c", borderRadius: "20px" }
};
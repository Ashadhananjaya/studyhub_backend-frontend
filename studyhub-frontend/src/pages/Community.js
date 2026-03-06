import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { noteService } from "../services/noteService";
import NoteCard from "../components/NoteCard";
import toast from "react-hot-toast";
import { Search, Users, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

function useDebounce(value, delay) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest" },
  { value: "likes",     label: "Most Liked" },
  { value: "title",     label: "A → Z" }
];

export default function Community() {
  const [notes, setNotes]       = useState([]);
  const [search, setSearch]     = useState("");
  const [loading, setLoading]   = useState(true);
  const [sortBy, setSortBy]     = useState("createdAt");
  const [page, setPage]         = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const PAGE_SIZE = 12;
  const debouncedSearch = useDebounce(search, 300);

  const fetchNotes = useCallback(async (currentPage, currentSort) => {
    setLoading(true);
    try {
      const res = await noteService.getPublicNotes(currentPage, PAGE_SIZE, currentSort);
      // Backend now returns a Page object: { content, totalPages, totalElements, ... }
      setNotes(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch {
      toast.error("Could not load community notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes(page, sortBy);
  }, [page, sortBy, fetchNotes]);

  // Reset to page 0 when sort changes
  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setPage(0);
  };

  const handleLike = async (id) => {
    try {
      await noteService.likeNote(id);
      fetchNotes(page, sortBy);
    } catch {
      toast.error("Could not like note.");
    }
  };

  // Client-side search filter on current page
  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (n.content || "").toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div style={s.page}>
      <Navbar />

      <main style={s.main}>

        {/* HEADER */}
        <motion.div
          style={s.pageHeader}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div style={s.headerLeft}>
            <div style={s.headerIcon}>
              <Users size={18} color="var(--accent-light)" />
            </div>
            <div>
              <h2 style={s.heading}>Community Notes</h2>
              <p style={s.subheading}>
                {totalElements} public note{totalElements !== 1 ? "s" : ""} shared by the community
              </p>
            </div>
          </div>
        </motion.div>

        {/* CONTROLS: search + sort */}
        <div style={s.controls}>
          <div style={s.searchWrapper}>
            <Search size={15} style={s.searchIcon} />
            <input
              style={s.searchInput}
              placeholder="Search community notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={s.sortWrapper}>
            <ArrowUpDown size={14} color="var(--text-muted)" />
            <select
              style={s.sortSelect}
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* NOTES GRID */}
        {loading ? (
          <div style={s.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={s.skeleton} className="skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <motion.div style={s.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Users size={32} color="var(--text-dim)" />
            <p>{search ? "No notes match your search." : "No public notes yet."}</p>
          </motion.div>
        ) : (
          <motion.div style={s.grid}>
            <AnimatePresence mode="wait">
              {filtered.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                >
                  <NoteCard note={n} onLike={handleLike} readonly />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && !search && (
          <div style={s.pagination}>
            <motion.button
              style={{ ...s.pageBtn, opacity: page === 0 ? 0.3 : 1 }}
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              whileHover={page > 0 ? { scale: 1.05 } : {}}
              whileTap={page > 0 ? { scale: 0.95 } : {}}
            >
              <ChevronLeft size={16} />
              Previous
            </motion.button>

            <div style={s.pageInfo}>
              <span style={s.pageNum}>Page {page + 1} of {totalPages}</span>
            </div>

            <motion.button
              style={{ ...s.pageBtn, opacity: page >= totalPages - 1 ? 0.3 : 1 }}
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              whileHover={page < totalPages - 1 ? { scale: 1.05 } : {}}
              whileTap={page < totalPages - 1 ? { scale: 0.95 } : {}}
            >
              Next
              <ChevronRight size={16} />
            </motion.button>
          </div>
        )}

      </main>
    </div>
  );
}

const s = {
  page: { minHeight: "100vh", background: "var(--bg)" },
  main: { maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" },
  headerLeft: { display: "flex", alignItems: "center", gap: "14px" },
  headerIcon: { width: "42px", height: "42px", background: "var(--accent-dim)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" },
  heading: { fontFamily: "'DM Serif Display', serif", fontSize: "1.6rem", color: "var(--text)", margin: 0 },
  subheading: { fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 },

  controls: { display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" },
  searchWrapper: { position: "relative", flex: 1, minWidth: "200px" },
  searchIcon: { position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)", pointerEvents: "none" },
  searchInput: { width: "100%", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "12px", padding: "11px 16px 11px 40px", color: "var(--text)", fontSize: "0.9rem", outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box" },

  sortWrapper: { display: "flex", alignItems: "center", gap: "8px", background: "var(--panel)", border: "1px solid var(--border)", borderRadius: "12px", padding: "0 14px" },
  sortSelect: { background: "transparent", border: "none", color: "var(--text)", fontSize: "0.875rem", fontWeight: "500", fontFamily: "'DM Sans', sans-serif", outline: "none", padding: "11px 0", cursor: "pointer" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" },
  skeleton: { height: "220px", borderRadius: "20px" },
  empty: { textAlign: "center", padding: "80px 20px", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", fontSize: "0.9rem" },

  pagination: { display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--border)" },
  pageBtn: { display: "flex", alignItems: "center", gap: "6px", background: "var(--panel)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "10px", padding: "10px 18px", fontSize: "0.875rem", fontWeight: "600", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" },
  pageInfo: { display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" },
  pageNum: { fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: "500" }
};

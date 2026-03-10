package com.studyhub.studyhub.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.studyhub.studyhub.dto.NoteRequestDTO;
import com.studyhub.studyhub.dto.NoteResponseDTO;
import com.studyhub.studyhub.model.Note;
import com.studyhub.studyhub.service.NoteService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notes")
@Validated
public class NoteController {

    @Autowired
    private NoteService noteService;

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    // ── Create note ──────────────────────────────────────────
    @PostMapping
    public ResponseEntity<NoteResponseDTO> createNote(
            @Valid @RequestBody NoteRequestDTO dto) {
        return ResponseEntity.ok(noteService.createNoteByEmail(currentEmail(), dto));
    }

    // ── Get my notes ─────────────────────────────────────────
    @GetMapping("/my")
    public ResponseEntity<List<NoteResponseDTO>> getMyNotes() {
        return ResponseEntity.ok(noteService.getUserNotesByEmail(currentEmail()));
    }

    // ── Update note ──────────────────────────────────────────
    @PutMapping("/{noteId}")
    public ResponseEntity<NoteResponseDTO> updateNote(
            @PathVariable Long noteId,
            @Valid @RequestBody NoteRequestDTO dto) {
        return ResponseEntity.ok(noteService.updateNoteByEmail(noteId, dto, currentEmail()));
    }

    // ── Delete note ──────────────────────────────────────────
    @DeleteMapping("/{noteId}")
    public ResponseEntity<Map<String, String>> deleteNote(@PathVariable Long noteId) {
        noteService.deleteNoteByEmail(noteId, currentEmail());
        return ResponseEntity.ok(Map.of("message", "Note deleted successfully"));
    }

    // ── Public notes with pagination + sorting ───────────────
    // GET /api/notes/public?page=0&size=12&sortBy=createdAt
    @GetMapping("/public")
    public ResponseEntity<Page<NoteResponseDTO>> getPublicNotes(
            @RequestParam(defaultValue = "0")        int page,
            @RequestParam(defaultValue = "12")       int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {

        // Cap page size at 50 to prevent abuse
        int safeSize = Math.min(size, 50);
        return ResponseEntity.ok(noteService.getPublicNotes(page, safeSize, sortBy));
    }

    // ── Like a note ──────────────────────────────────────────
    @PostMapping("/{noteId}/like")
    public ResponseEntity<NoteResponseDTO> likeNote(@PathVariable Long noteId) {
        return ResponseEntity.ok(noteService.likeNote(noteId));
    }
 @PostMapping("/search")
public List<Note> semanticSearch(@RequestBody String query) {
    return noteService.semanticSearch(query);
}
}

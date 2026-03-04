package com.studyhub.studyhub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyhub.studyhub.model.Note;
import com.studyhub.studyhub.service.NoteService;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @PostMapping
    public Note createNote(@RequestBody Note note) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return noteService.createNoteByEmail(email, note);
    }

    @GetMapping("/my")
    public List<Note> getMyNotes() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return noteService.getUserNotesByEmail(email);
    }

    @PutMapping("/{noteId}")
    public Note updateNote(@PathVariable Long noteId, @RequestBody Note note) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return noteService.updateNoteByEmail(noteId, note, email);
    }

    @DeleteMapping("/{noteId}")
    public String deleteNote(@PathVariable Long noteId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        noteService.deleteNoteByEmail(noteId, email);
        return "Deleted successfully";
    }
    @GetMapping("/public")
public List<Note> getPublicNotes() {
    return noteService.getPublicNotes();
}
}
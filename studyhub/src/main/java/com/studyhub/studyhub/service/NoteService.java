package com.studyhub.studyhub.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.studyhub.studyhub.model.Note;
import com.studyhub.studyhub.model.User;
import com.studyhub.studyhub.repository.NoteRepository;
import com.studyhub.studyhub.repository.UserRepository;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private UserRepository userRepository;

    // ✅ Create Note
    public Note createNoteByEmail(String email, Note note) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        note.setUser(user);
        return noteRepository.save(note);
    }

    // ✅ Get all notes of a user
    public List<Note> getUserNotesByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return noteRepository.findByUserId(user.getId());
    }

    // ✅ Get all public notes
    public List<Note> getPublicNotes() {
        return noteRepository.findByIsPublicTrue();
    }

    // ✅ Update Note logic
    public Note updateNoteByEmail(Long noteId, Note updatedNote, String email) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        // Ownership check: Only owner can update
        if (!note.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized update attempt");
        }

        note.setTitle(updatedNote.getTitle());
        note.setContent(updatedNote.getContent());
        
        // 🔥 This will now receive the boolean correctly because of @JsonProperty in Note.java
        note.setPublic(updatedNote.isPublic());

        return noteRepository.save(note);
    }

    // ✅ Delete Note
    public void deleteNoteByEmail(Long noteId, String email) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getUser().getEmail().equals(email)) {
            throw new RuntimeException("You cannot delete this note");
        }

        noteRepository.delete(note);
    }
}
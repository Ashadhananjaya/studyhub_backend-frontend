package com.studyhub.studyhub.service;

import java.time.LocalDateTime;
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

    public Note createNoteByEmail(String email, Note note) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        note.setUser(user);
        note.setCreatedAt(LocalDateTime.now());
        note.setLikes(0);

        return noteRepository.save(note);
    }

    public List<Note> getUserNotesByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return noteRepository.findByUserId(user.getId());
    }

    public Note updateNoteByEmail(Long noteId, Note updatedNote, String email) {
        Note existingNote = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!existingNote.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        existingNote.setTitle(updatedNote.getTitle());
        existingNote.setContent(updatedNote.getContent());
        // FIX: use correct setter
        existingNote.setPublicNote(updatedNote.isPublicNote());

        return noteRepository.save(existingNote);
    }

    public void deleteNoteByEmail(Long noteId, String email) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        noteRepository.delete(note);
    }

    public List<Note> getPublicNotes() {
        // FIX: use correct repository method
        return noteRepository.findByPublicNoteTrue();
    }

    // NEW: Like a note (anyone can like, increments count)
    public Note likeNote(Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        note.setLikes(note.getLikes() + 1);
        return noteRepository.save(note);
    }
}
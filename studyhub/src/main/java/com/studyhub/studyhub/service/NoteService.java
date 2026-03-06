package com.studyhub.studyhub.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.studyhub.studyhub.dto.NoteRequestDTO;
import com.studyhub.studyhub.dto.NoteResponseDTO;
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

    public NoteResponseDTO createNoteByEmail(String email, NoteRequestDTO dto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Note note = new Note();
        note.setTitle(dto.getTitle());
        note.setContent(dto.getContent());
        note.setPublicNote(dto.isPublic());
        note.setUser(user);
        note.setCreatedAt(LocalDateTime.now());
        note.setLikes(0);

        return NoteResponseDTO.from(noteRepository.save(note));
    }

    public List<NoteResponseDTO> getUserNotesByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return noteRepository.findByUserId(user.getId())
                .stream()
                .map(NoteResponseDTO::from)
                .collect(Collectors.toList());
    }

    public NoteResponseDTO updateNoteByEmail(Long noteId, NoteRequestDTO dto, String email) {
        Note existing = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!existing.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        existing.setTitle(dto.getTitle());
        existing.setContent(dto.getContent());
        existing.setPublicNote(dto.isPublic());

        return NoteResponseDTO.from(noteRepository.save(existing));
    }

    public void deleteNoteByEmail(Long noteId, String email) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        if (!note.getUser().getEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }

        noteRepository.delete(note);
    }

    public Page<NoteResponseDTO> getPublicNotes(int page, int size, String sortBy) {
        String safeSort = List.of("createdAt", "likes", "title").contains(sortBy)
                ? sortBy : "createdAt";

        Pageable pageable = PageRequest.of(page, size, Sort.by(safeSort).descending());

        return noteRepository.findByPublicNoteTrue(pageable)
                .map(NoteResponseDTO::from);
    }

    public NoteResponseDTO likeNote(Long noteId) {
        Note note = noteRepository.findById(noteId)
                .orElseThrow(() -> new RuntimeException("Note not found"));

        note.setLikes(note.getLikes() + 1);
        return NoteResponseDTO.from(noteRepository.save(note));
    }
}

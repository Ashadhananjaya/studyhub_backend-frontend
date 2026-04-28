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

    @Autowired
    private AIService aiService;

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

        try {
            if (dto.getContent() != null && !dto.getContent().isBlank()) {
                List<Double> embedding = aiService.getEmbedding(dto.getContent());
                note.setEmbedding(embedding);
            }
        } catch (Exception e) {
            System.out.println("[AI] Embedding skipped: " + e.getMessage());
        }

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

        try {
            if (dto.getContent() != null && !dto.getContent().isBlank()) {
                List<Double> embedding = aiService.getEmbedding(dto.getContent());
                existing.setEmbedding(embedding);
            }
        } catch (Exception e) {
            System.out.println("[AI] Embedding update skipped: " + e.getMessage());
        }

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
// Replace your existing likeNote method with this one
public NoteResponseDTO likeNote(Long noteId, String email) {
    Note note = noteRepository.findById(noteId)
            .orElseThrow(() -> new RuntimeException("Note not found"));

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // TOGGLE LOGIC
    if (note.getLikedByUsers().contains(user)) {
        // Already liked -> UNLIKE
        note.getLikedByUsers().remove(user);
        note.setLikes(Math.max(0, note.getLikes() - 1));
    } else {
        // Not liked yet -> LIKE
        note.getLikedByUsers().add(user);
        note.setLikes(note.getLikes() + 1);
    }

    return NoteResponseDTO.from(noteRepository.save(note));
}

    // SEMANTIC SEARCH
    public List<Note> semanticSearch(String query) {

        List<Double> queryEmbedding = aiService.getEmbedding(query);

        List<Note> notes = noteRepository.findAll();

        notes.sort((a, b) -> {
            double simA = cosineSimilarity(queryEmbedding, parseEmbedding(a.getEmbedding()));
            double simB = cosineSimilarity(queryEmbedding, parseEmbedding(b.getEmbedding()));
            return Double.compare(simB, simA);
        });

        return notes.subList(0, Math.min(5, notes.size()));
    }

   private double cosineSimilarity(List<Double> v1, List<Double> v2) {

    double dot = 0;
    double normA = 0;
    double normB = 0;

    for (int i = 0; i < v1.size(); i++) {
        dot += v1.get(i) * v2.get(i);
        normA += Math.pow(v1.get(i), 2);
        normB += Math.pow(v2.get(i), 2);
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
private List<Double> parseEmbedding(Float[] embedding) {

    if (embedding == null) return List.of();

    List<Double> result = new java.util.ArrayList<>();

    for (Float f : embedding) {
        result.add(f.doubleValue());
    }

    return result;
}
}
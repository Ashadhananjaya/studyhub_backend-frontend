package com.studyhub.studyhub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studyhub.studyhub.model.Note;

public interface NoteRepository extends JpaRepository<Note, Long> {

    // Get notes by owner
    List<Note> findByUserId(Long userId);

    // Get only public notes
    List<Note> findByIsPublicTrue();
}

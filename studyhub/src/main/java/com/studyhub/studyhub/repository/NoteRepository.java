package com.studyhub.studyhub.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.studyhub.studyhub.model.Note;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUserId(Long userId);

    // Pagination support for public notes
    Page<Note> findByPublicNoteTrue(Pageable pageable);
}


// package com.studyhub.studyhub.repository;

// import java.util.List;

// import org.springframework.data.jpa.repository.JpaRepository;

// import com.studyhub.studyhub.model.Note;

// public interface NoteRepository extends JpaRepository<Note, Long> {
//     List<Note> findByUserId(Long userId);
// }
package com.studyhub.studyhub.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studyhub.studyhub.model.Note;

public interface NoteRepository extends JpaRepository<Note, Long> {

    List<Note> findByUserId(Long userId);

    // fetch all public notes
    List<Note> findByIsPublicTrue();
}

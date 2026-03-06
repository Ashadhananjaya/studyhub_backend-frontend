package com.studyhub.studyhub.dto;

import java.time.LocalDateTime;

import com.studyhub.studyhub.model.Note;

public class NoteResponseDTO {

    private Long id;
    private String title;
    private String content;
    private boolean isPublic;
    private int likes;
    private LocalDateTime createdAt;

    // Only expose safe user info — never the full User entity (which has password hash etc.)
    private String authorName;
    private String authorEmail;

    // Static factory — converts Note entity → DTO cleanly
    public static NoteResponseDTO from(Note note) {
        NoteResponseDTO dto = new NoteResponseDTO();
        dto.id          = note.getId();
        dto.title       = note.getTitle();
        dto.content     = note.getContent();
        dto.isPublic    = note.isPublicNote();
        dto.likes       = note.getLikes();
        dto.createdAt   = note.getCreatedAt();

        if (note.getUser() != null) {
            dto.authorName  = note.getUser().getUsername();
            dto.authorEmail = note.getUser().getEmail();
        }

        return dto;
    }

    // ── Getters ──────────────────────────────────────────────

    public Long getId()                { return id; }
    public String getTitle()           { return title; }
    public String getContent()         { return content; }
    public boolean isPublic()          { return isPublic; }
    public int getLikes()              { return likes; }
    public LocalDateTime getCreatedAt(){ return createdAt; }
    public String getAuthorName()      { return authorName; }
    public String getAuthorEmail()     { return authorEmail; }
}

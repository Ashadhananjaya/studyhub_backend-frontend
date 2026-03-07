package com.studyhub.studyhub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.studyhub.studyhub.model.Note;
import java.time.LocalDateTime;

public class NoteResponseDTO {

    private Long id;
    private String title;
    private String content;

    // FIX: same isPublic bug - must use @JsonProperty so frontend gets "isPublic" not "public"
    @JsonProperty("isPublic")
    private boolean isPublic;

    private int likes;
    private LocalDateTime createdAt;
    private String authorName;
    private String authorEmail;

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

    public Long getId()                 { return id; }
    public String getTitle()            { return title; }
    public String getContent()          { return content; }

    @JsonProperty("isPublic")
    public boolean isPublic()           { return isPublic; }

    public int getLikes()               { return likes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public String getAuthorName()       { return authorName; }
    public String getAuthorEmail()      { return authorEmail; }
}
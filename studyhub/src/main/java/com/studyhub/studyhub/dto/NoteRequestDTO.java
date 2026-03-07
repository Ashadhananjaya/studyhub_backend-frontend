package com.studyhub.studyhub.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class NoteRequestDTO {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be under 150 characters")
    private String title;

    @Size(max = 10000, message = "Content must be under 10,000 characters")
    private String content;

    // FIX: @JsonProperty tells Jackson to map "isPublic" from frontend JSON
    // to this field correctly - without this, setter never gets called
    @JsonProperty("isPublic")
    private boolean isPublic;

    public NoteRequestDTO() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    @JsonProperty("isPublic")
    public boolean isPublic() { return isPublic; }

    @JsonProperty("isPublic")
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
}
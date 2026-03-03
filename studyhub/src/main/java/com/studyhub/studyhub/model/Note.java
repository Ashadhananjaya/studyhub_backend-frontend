package com.studyhub.studyhub.model;

import java.time.LocalDateTime; // 🔥 CRITICAL IMPORT

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String content;

    @JsonProperty("isPublic") // 🔥 This tells Jackson: "Look for the name isPublic in the JSON"
    private boolean isPublic = false;

    private LocalDateTime createdAt;

    // 🔗 Many Notes belong to One User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Note() {
        this.createdAt = LocalDateTime.now();
    }

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @JsonProperty("isPublic") // 🔥 Force the getter to use the right key
    public boolean isPublic() {
        return isPublic;
    }

    @JsonProperty("isPublic") // 🔥 Force the setter to use the right key
    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
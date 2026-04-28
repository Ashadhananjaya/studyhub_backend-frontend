package com.studyhub.studyhub.model;

import java.time.LocalDateTime;
import java.util.HashSet; // Added
import java.util.List;
import java.util.Set;    // Added

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column; // Using wildcard for cleaner look
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "notes")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_public")
    @JsonProperty("isPublic")
    private boolean publicNote;

    private int likes;
    private LocalDateTime createdAt;

    @JsonIgnore
    @Column(columnDefinition = "real[]")
    private Float[] embedding;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // --- NEW: LIKES RELATIONSHIP ---
    @ManyToMany
    @JoinTable(
      name = "note_likes",
      joinColumns = @JoinColumn(name = "note_id"),
      inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore // Prevent circular reference in JSON
    private Set<User> likedByUsers = new HashSet<>();

    public Note() {}

    // Getters and Setters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    @JsonProperty("isPublic")
    public boolean isPublicNote() { return publicNote; }
    public void setPublicNote(boolean publicNote) { this.publicNote = publicNote; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Float[] getEmbedding() { return embedding; }
    public void setEmbedding(List<Double> embeddingList) {
        if (embeddingList == null) return;
        Float[] arr = new Float[embeddingList.size()];
        for (int i = 0; i < embeddingList.size(); i++) {
            arr[i] = embeddingList.get(i).floatValue();
        }
        this.embedding = arr;
    }

    public Set<User> getLikedByUsers() { return likedByUsers; }
    public void setLikedByUsers(Set<User> likedByUsers) { this.likedByUsers = likedByUsers; }
}
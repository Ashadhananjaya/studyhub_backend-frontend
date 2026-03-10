package com.studyhub.studyhub.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.studyhub.studyhub.model.Note;
import com.studyhub.studyhub.service.AIService;
import com.studyhub.studyhub.service.NoteService;

@RestController
@RequestMapping("/ai")
public class AiController {

    @Autowired
    private AIService aiService;

    @Autowired
    private NoteService noteService;

    @PostMapping("/embed")
    public List<Double> embed(@RequestBody String text) {
        return aiService.getEmbedding(text);
    }

    @PostMapping("/search")
    public List<Note> semanticSearch(@RequestBody String query) {
        return noteService.semanticSearch(query);
    }
}
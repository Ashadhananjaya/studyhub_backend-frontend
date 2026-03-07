package com.studyhub.studyhub.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.studyhub.studyhub.dto.EmbeddingRequest;
import com.studyhub.studyhub.dto.EmbeddingResponse;

@Service
public class AIService {

    private final String AI_URL = "http://localhost:8001/embed";

    public List<Double> getEmbedding(String text) {

        RestTemplate restTemplate = new RestTemplate();

        EmbeddingRequest request = new EmbeddingRequest(text);

        EmbeddingResponse response =
                restTemplate.postForObject(AI_URL, request, EmbeddingResponse.class);

        return response.getEmbedding();
    }
}
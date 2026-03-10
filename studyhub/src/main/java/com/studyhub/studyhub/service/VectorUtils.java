package com.studyhub.studyhub.service;

public class VectorUtils {

    public static double cosineSimilarity(Float[] a, Float[] b) {

        if (a == null || b == null) return -1;

        double dot = 0;
        double normA = 0;
        double normB = 0;

        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += Math.pow(a[i], 2);
            normB += Math.pow(b[i], 2);
        }

        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}
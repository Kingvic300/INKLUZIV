package com.inkluziv.mapper;

import com.inkluziv.data.model.Embedding;
import com.inkluziv.dto.response.EmbeddingResponse;

public class EmbeddingMapper {
    public static EmbeddingResponse mapToEmbeddingResponse(String message, Embedding embedding) {
        EmbeddingResponse embeddingResponse = new EmbeddingResponse();
        embeddingResponse.setMessage(message);
        embeddingResponse.setEmbedding(embedding);
        return embeddingResponse;
    }
}

package com.inkluziv.dto.response;

import com.inkluziv.data.model.Embedding;
import lombok.Data;

@Data
public class EmbeddingResponse {
    private String message;
    private Embedding embedding;
}

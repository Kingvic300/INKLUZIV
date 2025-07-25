package com.inkluziv.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class PythonEmbeddingResponse {
    private Long file_id;
    private List<Double> embedding;
    private int feature_count;
}

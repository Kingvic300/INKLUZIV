package com.inkluziv.data.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;
import lombok.Data;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Entity
public class Embedding {

    @Id
    private Long id;

    private String voicePrint;

    private String createdAt;

    private int feature_count;

    @Transient
    public List<Double> getVoicePrintList() {
        if (voicePrint == null || voicePrint.isEmpty()) return List.of();
        return Arrays.stream(voicePrint.split(","))
                .map(Double::parseDouble)
                .collect(Collectors.toList());
    }

    @Transient
    public void setVoicePrintList(List<Double> list) {
        if (list == null || list.isEmpty()) {
            this.voicePrint = "";
        } else {
            this.voicePrint = list.stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(","));
        }
    }
}

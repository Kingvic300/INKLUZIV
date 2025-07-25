package com.inkluziv.service;

import com.inkluziv.dto.response.EmbeddingResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface VoiceAuthenticationService {
    EmbeddingResponse extractVoiceFeatures(MultipartFile voiceSample) throws IOException;
    boolean verifyVoice(MultipartFile voiceSample, String storedVoicePrint) throws IOException;
    String generateSecurePassword();
}

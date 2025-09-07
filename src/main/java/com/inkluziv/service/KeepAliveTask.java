package com.inkluziv.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class KeepAliveTask {

    private static final String URL = "https://inkluziv.onrender.com";
    private final RestTemplate restTemplate = new RestTemplate();

    @Scheduled(fixedRate = 40000)
    public void pingServer() {
        try {
            String response = restTemplate.getForObject(URL, String.class);
            System.out.println("Pinged backend at " + URL + " | Response: " + response);
        } catch (Exception e) {
            System.err.println("Error pinging backend: " + e.getMessage());
        }
    }
}


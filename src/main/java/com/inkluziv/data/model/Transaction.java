package com.inkluziv.data.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;
    private String userId;
    private String recipientAddress;
    private String recipientName;
    private BigDecimal amountNaira;
    private BigDecimal amountUSDT;
    private BigDecimal exchangeRate;
    private String transactionHash;
    private String status; // PENDING, COMPLETED, FAILED
    private String type; // SEND, RECEIVE
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    private String description;
    private String networkFee;
}
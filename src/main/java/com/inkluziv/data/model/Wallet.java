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
@Document(collection = "wallets")
public class Wallet {

    @Id
    private String id;
    private String userId;
    private String walletAddress;
    private String privateKey; // Encrypted
    private BigDecimal balanceNaira;
    private BigDecimal balanceUSDT;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isActive;
}
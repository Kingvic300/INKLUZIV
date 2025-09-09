package com.inkluziv.dto.response;

import com.inkluziv.data.model.Transaction;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionHistoryResponse {
    private String message;
    private List<Transaction> transactions;
    private int totalPages;
    private long totalElements;
    private int currentPage;
}
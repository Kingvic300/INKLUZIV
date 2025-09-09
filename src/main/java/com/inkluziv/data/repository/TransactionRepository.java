package com.inkluziv.data.repository;

import com.inkluziv.data.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByUserIdOrderByCreatedAtDesc(String userId);
    Page<Transaction> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);
    List<Transaction> findByUserIdAndStatusOrderByCreatedAtDesc(String userId, String status);
}
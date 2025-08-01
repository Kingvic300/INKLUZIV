package com.inkluziv.data.repository;

import com.inkluziv.data.model.Embedding;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmbeddingRepository extends MongoRepository<Embedding , String> {
}

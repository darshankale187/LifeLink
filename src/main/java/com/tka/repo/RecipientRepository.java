package com.tka.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tka.model.Recipient;

public interface RecipientRepository extends JpaRepository<Recipient, Integer> {

}

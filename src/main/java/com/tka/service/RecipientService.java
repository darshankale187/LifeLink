package com.tka.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.tka.model.Recipient;
import com.tka.repo.RecipientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RecipientService {

	private final RecipientRepository repo;

	public Recipient add(Recipient recipient) {
		return repo.save(recipient);
	}

	public List<Recipient> getAll() {
		return repo.findAll();
	}

	public Recipient getById(int id) {
		return repo.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipient not found"));
	}
}

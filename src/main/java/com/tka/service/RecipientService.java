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
		recipient.setId(0);
		return repo.save(recipient);
	}

	public List<Recipient> getAll() {
		return repo.findAll();
	}

	public Recipient getById(int id) {
		return repo.findById(id).orElseThrow(this::notFound);
	}

	public Recipient update(int id, Recipient recipient) {
		if (!repo.existsById(id)) {
			throw notFound();
		}
		recipient.setId(id);
		return repo.save(recipient);
	}

	public void delete(int id) {
		if (!repo.existsById(id)) {
			throw notFound();
		}
		repo.deleteById(id);
	}

	private ResponseStatusException notFound() {
		return new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipient not found");
	}
}
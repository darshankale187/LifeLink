package com.tka.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.tka.model.Recipient;
import com.tka.service.RecipientService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recipients")
@RequiredArgsConstructor
public class RecipientController {

	private final RecipientService service;

	@PostMapping
	public Recipient add(@Valid @RequestBody Recipient recipient) {
		return service.add(recipient);
	}

	@GetMapping
	public List<Recipient> getAll() {
		return service.getAll();
	}

	@PutMapping("/{id}")
	public Recipient update(@PathVariable int id, @Valid @RequestBody Recipient recipient) {
		return service.update(id, recipient);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable int id) {
		service.delete(id);
	}
}
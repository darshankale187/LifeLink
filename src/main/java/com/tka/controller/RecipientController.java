package com.tka.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tka.model.Recipient;
import com.tka.service.RecipientService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/recipients")
@RequiredArgsConstructor
public class RecipientController {

	private final RecipientService service;

	@PostMapping
	public Recipient add(@RequestBody Recipient recipient) {
		return service.add(recipient);
	}

	@GetMapping
	public List<Recipient> getAll() {
		return service.getAll();
	}
}

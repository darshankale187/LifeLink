package com.tka.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tka.model.Donor;
import com.tka.service.DonorService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/donors")
@RequiredArgsConstructor
public class DonorController {

	private final DonorService service;

	@PostMapping
	public Donor add(@RequestBody Donor donor) {
		return service.add(donor);
	}

	@GetMapping
	public List<Donor> getAll() {
		return service.getAll();
	}
}

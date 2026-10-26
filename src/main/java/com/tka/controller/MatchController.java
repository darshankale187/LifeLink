package com.tka.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tka.model.Donor;
import com.tka.service.MatchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
public class MatchController {

	private final MatchService service;

	@GetMapping("/{recipientId}")
	public List<Donor> match(@PathVariable int recipientId) {
		return service.findMatches(recipientId);
	}
}

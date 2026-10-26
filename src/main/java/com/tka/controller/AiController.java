package com.tka.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.tka.model.Donor;
import com.tka.model.Recipient;
import com.tka.service.AiService;
import com.tka.service.MatchService;
import com.tka.service.RecipientService;
import com.tka.service.StatsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AiController {

	private final AiService ai;
	private final StatsService stats;
	private final MatchService matchService;
	private final RecipientService recipientService;

	@GetMapping("/match/{recipientId}/explain")
	public Map<String, String> explain(@PathVariable int recipientId) {
		Recipient r = recipientService.getById(recipientId);
		List<Donor> donors = matchService.findMatches(recipientId);

		if (donors.isEmpty()) {
			return Map.of("explanation", "No compatible donors found.");
		}
		return Map.of("explanation", ai.explain(r, donors));
	}

	@PostMapping("/assistant")
	public Map<String, String> assistant(@RequestBody Map<String, List<Map<String, String>>> req) {
		List<Map<String, String>> messages = req.get("messages");

		if (messages == null || messages.isEmpty()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "messages are required");
		}
		return Map.of("answer", ai.chat(messages, stats.summary()));
	}
}
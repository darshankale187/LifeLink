package com.tka.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.tka.model.Donor;
import com.tka.model.Recipient;

@Service
public class AiService {

	@Value("${ai.api.key}")
	private String apiKey;

	@Value("${ai.model}")
	private String model;

	private final RestTemplate rest = new RestTemplate();

	private static final String EXPLAIN_PROMPT = """
			You explain organ donor matches to a hospital coordinator.
			Use simple English, max 5 short bullet points.
			Mention blood group compatibility, organ and city.
			End with one line: this is a demo and real matching needs doctors.
			""";

	private static final String CHAT_PROMPT = """
			You answer general questions about organ donation in India.
			Keep answers under 120 words, in simple English.
			Give general information only, not medical advice.
			For personal or medical questions, tell the user to consult a doctor
			and visit https://notto.mohfw.gov.in
			""";

	public String explain(Recipient r, List<Donor> donors) {
		StringBuilder sb = new StringBuilder();
		sb.append("Recipient: blood ").append(r.getBloodGroup()).append(", needs ").append(r.getOrganNeeded())
				.append(", city ").append(r.getCity()).append(", urgency ").append(r.getUrgency()).append("/5\n");
		sb.append("Matched donors:\n");

		for (Donor d : donors) {
			sb.append("- blood ").append(d.getBloodGroup()).append(", ").append(d.getOrgan()).append(", city ")
					.append(d.getCity()).append("\n");
		}
		return ask(EXPLAIN_PROMPT, sb.toString());
	}

	public String chat(String question) {
		return ask(CHAT_PROMPT, question);
	}

	@SuppressWarnings("unchecked")
	private String ask(String system, String userMessage) {
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.set("x-api-key", apiKey);
			headers.set("anthropic-version", "2023-06-01");
			headers.setContentType(MediaType.APPLICATION_JSON);

			Map<String, Object> body = Map.of("model", model, "max_tokens", 400, "system", system, "messages",
					List.of(Map.of("role", "user", "content", userMessage)));

			Map<String, Object> res = rest.postForObject("https://api.anthropic.com/v1/messages",
					new HttpEntity<>(body, headers), Map.class);

			List<Map<String, Object>> content = (List<Map<String, Object>>) res.get("content");
			return content.get(0).get("text").toString();

		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI service error: " + e.getMessage());
		}
	}
}

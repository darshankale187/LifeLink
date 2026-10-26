package com.tka.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import com.tka.model.Donor;
import com.tka.model.Recipient;

@Service
public class AiService {

	@Value("${ai.api.key}")
	private String apiKey;

	@Value("${ai.model}")
	private String model;

	private final RestClient rest = RestClient.create();

	private static final String URL = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent";

	private static final String EXPLAIN_PROMPT = """
			You explain organ donor matches to a hospital coordinator.
			Use simple English, max 5 short bullet points.
			Mention blood group compatibility, organ and city.
			End with one line: this is a demo and real matching needs doctors.
			""";

	private static final String CHAT_PROMPT = """
			You are LifeLink Assistant, a chatbot inside an organ donor management demo app.
			Rules:
			- For questions about the app's data, answer ONLY from the live data below.
			  If the data does not contain the answer, say so. Never invent numbers.
			- For general organ donation questions, give simple general information, not medical advice.
			  For personal medical questions, tell the user to consult a doctor and visit https://notto.mohfw.gov.in
			- Never ask for or reveal names, phone numbers or other personal details.
			- If the question is unrelated to organ donation or this app, politely say you can only help with those topics.
			- Keep answers under 150 words. Use bullet points for lists.
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
		return call(EXPLAIN_PROMPT, List.of(turn("user", sb.toString())));
	}

	public String chat(List<Map<String, String>> history, String context) {
		List<Map<String, Object>> contents = new ArrayList<>();
		int start = Math.max(0, history.size() - 10);

		for (Map<String, String> m : history.subList(start, history.size())) {
			String role = "assistant".equals(m.get("role")) ? "model" : "user";
			String text = String.valueOf(m.getOrDefault("text", ""));
			if (text.length() > 1000)
				text = text.substring(0, 1000);

			// Gemini ki conversation hamesha user message se shuru honi chahiye
			if (contents.isEmpty() && role.equals("model"))
				continue;
			contents.add(turn(role, text));
		}
		return call(CHAT_PROMPT + "\nLive data:\n" + context, contents);
	}

	private Map<String, Object> turn(String role, String text) {
		return Map.of("role", role, "parts", List.of(Map.of("text", text)));
	}

	@SuppressWarnings("unchecked")
	private String call(String system, List<Map<String, Object>> contents) {
		try {
			Map<String, Object> body = Map.of("system_instruction", Map.of("parts", List.of(Map.of("text", system))),
					"contents", contents, "generationConfig", Map.of("maxOutputTokens", 1000));

			Map<String, Object> res = rest.post().uri(URL.formatted(model)).header("x-goog-api-key", apiKey)
					.contentType(MediaType.APPLICATION_JSON).body(body).retrieve().body(Map.class);

			List<Map<String, Object>> candidates = (List<Map<String, Object>>) res.get("candidates");
			Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
			List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
			return parts.get(0).get("text").toString();

		} catch (Exception e) {
			throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI service error: " + e.getMessage());
		}
	}
}
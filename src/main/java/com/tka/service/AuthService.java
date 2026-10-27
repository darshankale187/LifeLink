package com.tka.service;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.tka.model.User;
import com.tka.repo.UserRepository;
import com.tka.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

	private final UserRepository repo;
	private final PasswordEncoder encoder;
	private final JwtService jwt;

	public Map<String, String> register(String username, String password) {
		if (username == null || username.trim().length() < 3 || password == null || password.length() < 6) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
					"Username must be at least 3 characters and password at least 6");
		}
		if (repo.existsByUsername(username.trim())) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "Username already taken");
		}

		User u = new User();
		u.setUsername(username.trim());
		u.setPassword(encoder.encode(password));
		u.setRole("USER");
		repo.save(u);

		return response(u);
	}

	public Map<String, String> login(String username, String password) {
		if (username == null || password == null) {
			throw invalid();
		}
		User u = repo.findByUsername(username.trim()).orElseThrow(this::invalid);

		if (!encoder.matches(password, u.getPassword())) {
			throw invalid();
		}
		return response(u);
	}

	private ResponseStatusException invalid() {
		return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
	}

	private Map<String, String> response(User u) {
		return Map.of("token", jwt.generate(u.getUsername(), u.getRole()), "username", u.getUsername(), "role",
				u.getRole());
	}
}
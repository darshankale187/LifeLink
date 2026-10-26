package com.tka.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import com.tka.model.Donor;
import com.tka.model.Recipient;
import com.tka.repo.DonorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchService {

	private final DonorRepository donorRepo;
	private final RecipientService recipientService;

	public List<Donor> findMatches(int recipientId) {
		Recipient r = recipientService.getById(recipientId);

		return donorRepo.findByOrganIgnoreCaseAndAvailableTrue(r.getOrganNeeded()).stream()
				.filter(d -> compatible(d.getBloodGroup(), r.getBloodGroup()))
				.sorted(Comparator.comparing((Donor d) -> !d.getCity().equalsIgnoreCase(r.getCity()))).toList();
	}

	// ABO rule: O donor sabko de sakta hai, AB recipient sabse le sakta hai
	private boolean compatible(String donor, String recipient) {
		String d = donor.replaceAll("[+-]", "").toUpperCase();
		String r = recipient.replaceAll("[+-]", "").toUpperCase();

		return switch (d) {
		case "O" -> true;
		case "A" -> r.equals("A") || r.equals("AB");
		case "B" -> r.equals("B") || r.equals("AB");
		default -> r.equals("AB");
		};
	}
}
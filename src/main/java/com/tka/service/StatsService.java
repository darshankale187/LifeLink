package com.tka.service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.TreeMap;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.tka.model.Donor;
import com.tka.model.Recipient;
import com.tka.repo.DonorRepository;
import com.tka.repo.RecipientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StatsService {

	private final DonorRepository donorRepo;
	private final RecipientRepository recipientRepo;

	// AI ko sirf counts dete hain, naam ya phone nahi
	public String summary() {
		List<Donor> donors = donorRepo.findAll();
		List<Donor> available = donors.stream().filter(Donor::isAvailable).toList();
		List<Recipient> recipients = recipientRepo.findAll();

		return """
				Total donors: %d
				Available donors: %d
				Waiting recipients: %d
				Urgent recipients (urgency 4-5): %d
				Available donors by organ: %s
				Waiting recipients by organ: %s
				Available donors by city: %s
				Waiting recipients by city: %s
				Available donors by blood group: %s
				Waiting recipients by blood group: %s
				""".formatted(donors.size(), available.size(), recipients.size(),
				recipients.stream().filter(r -> r.getUrgency() >= 4).count(), count(available, Donor::getOrgan),
				count(recipients, Recipient::getOrganNeeded), count(available, Donor::getCity),
				count(recipients, Recipient::getCity), count(available, Donor::getBloodGroup),
				count(recipients, Recipient::getBloodGroup));
	}

	private <T> Map<String, Long> count(List<T> list, Function<T, String> field) {
		return list.stream().map(field).filter(Objects::nonNull).map(String::toLowerCase)
				.collect(Collectors.groupingBy(v -> v, TreeMap::new, Collectors.counting()));
	}
}
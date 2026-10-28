package com.tka.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.tka.model.Donor;
import com.tka.repo.DonorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonorService {

	private final DonorRepository repo;

	public Donor add(Donor donor) {
		donor.setId(0); // naya record hamesha insert ho, purana overwrite na ho
		return repo.save(donor);
	}

	public List<Donor> getAll() {
		return repo.findAll();
	}

	public Donor update(int id, Donor donor) {
		if (!repo.existsById(id)) {
			throw notFound();
		}
		donor.setId(id);
		return repo.save(donor);
	}

	public void delete(int id) {
		if (!repo.existsById(id)) {
			throw notFound();
		}
		repo.deleteById(id);
	}

	private ResponseStatusException notFound() {
		return new ResponseStatusException(HttpStatus.NOT_FOUND, "Donor not found");
	}
}
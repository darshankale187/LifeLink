package com.tka.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.tka.model.Donor;
import com.tka.repo.DonorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonorService {

    private final DonorRepository repo;

    public Donor add(Donor donor) {
        return repo.save(donor);
    }

    public List<Donor> getAll() {
        return repo.findAll();
    }
}

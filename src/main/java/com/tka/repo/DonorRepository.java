package com.tka.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tka.model.*;

public interface DonorRepository extends JpaRepository<Donor, Integer> {
	List<Donor> findByOrganIgnoreCaseAndAvailableTrue(String organ);
}

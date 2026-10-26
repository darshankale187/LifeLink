package com.tka.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
@Entity
public class Donor {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@NotBlank(message = "Name is required")
	private String name;

	@Min(value = 18, message = "Donor age must be between 18 and 65")
	@Max(value = 65, message = "Donor age must be between 18 and 65")
	private int age;

	@Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Blood group must be like A+, O-, AB+")
	private String bloodGroup;

	@Pattern(regexp = "(?i)^(Kidney|Liver|Heart|Lung|Pancreas|Cornea)$", message = "Organ must be Kidney, Liver, Heart, Lung, Pancreas or Cornea")
	private String organ;

	@NotBlank(message = "City is required")
	private String city;

	@Pattern(regexp = "^[0-9]{10}$", message = "Phone must be 10 digits")
	private String phone;

	private boolean available = true;
}
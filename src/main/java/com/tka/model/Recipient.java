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
public class Recipient {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@NotBlank(message = "Name is required")
	private String name;

	@Min(value = 1, message = "Age must be between 1 and 100")
	@Max(value = 100, message = "Age must be between 1 and 100")
	private int age;

	@Pattern(regexp = "^(A|B|AB|O)[+-]$", message = "Blood group must be like A+, O-, AB+")
	private String bloodGroup;

	@Pattern(regexp = "(?i)^(Kidney|Liver|Heart|Lung|Pancreas|Cornea)$", message = "Organ must be Kidney, Liver, Heart, Lung, Pancreas or Cornea")
	private String organNeeded;

	@NotBlank(message = "City is required")
	private String city;

	@Min(value = 1, message = "Urgency must be between 1 and 5")
	@Max(value = 5, message = "Urgency must be between 1 and 5")
	private int urgency;

	private String status = "WAITING";
}
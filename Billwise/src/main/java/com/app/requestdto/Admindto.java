package com.app.requestdto;

import org.hibernate.annotations.NotFound;

import jakarta.validation.constraints.NotBlank;

public class Admindto {
	   @NotBlank(message = "Admin name must be entered")
       String name;
	   
	   @NotBlank(message = "Admin password must be entered")
       String password;
}

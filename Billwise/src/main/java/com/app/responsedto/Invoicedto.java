package com.app.responsedto;

import java.time.Instant;
import java.time.LocalDate;

import com.app.enums.InvoiceStatus;
import com.app.models.Customer;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
@Data
public class Invoicedto {
	   private int id;
	   private String Invoice_number;
	   private LocalDate Invoice_date;
	   private Instant created_at;
	   private Instant updated_at;
	   private LocalDate Invoice_due_date;
	   private double Invoice_amount;
	   private String description;
	   private InvoiceStatus invoice_status;
	   private Customer customer; 
}

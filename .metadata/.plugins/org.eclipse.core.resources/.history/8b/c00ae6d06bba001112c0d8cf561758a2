package com.app.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.models.ReminderAttempt;

public interface RemainderAttemptjpa extends JpaRepository<ReminderAttempt, Integer> {
	boolean existsByInvoiceIdAndDate(
	        int invoiceId,
	        LocalDate date
	);
}

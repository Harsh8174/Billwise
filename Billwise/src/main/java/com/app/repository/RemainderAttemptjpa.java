package com.app.repository;

import java.time.Instant;
import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.enums.Reminderperiod;
import com.app.models.ReminderAttempt;

public interface RemainderAttemptjpa extends JpaRepository<ReminderAttempt, Integer> {

	 boolean existsByInvoice_IdAndDateAndRemainderperiod(
	            int invoice_id,
	            LocalDate date,
	            Reminderperiod type
	    );
	
}

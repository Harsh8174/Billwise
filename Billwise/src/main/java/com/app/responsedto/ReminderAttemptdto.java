package com.app.responsedto;

import java.time.LocalDate;

import com.app.enums.Reminderperiod;

import jakarta.persistence.Column;
import lombok.Data;
@Data
public class ReminderAttemptdto {

	private int id;
	private Reminderperiod remainderperiod;
	private String status;
	private LocalDate attemptedAt;
	private int invoice_id;
}

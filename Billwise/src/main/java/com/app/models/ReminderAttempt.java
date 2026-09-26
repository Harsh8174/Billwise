package com.app.models;

import java.time.LocalDate;

import com.app.enums.Reminderperiod;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.Data;
@Data
@Entity
public class ReminderAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
    @Enumerated(EnumType.STRING)
    private Reminderperiod remainderperiod;
    private String status;
    @Column(name = "Attempted_date")
    private LocalDate date;
    @ManyToOne
    @JoinColumn(name = "Invoice_id")
    private Invoice invoice;
}

package com.app.models;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import com.app.enums.Reminderperiod;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.annotation.Generated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;
@Data
@Entity
public class SchedulerJob {
	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
     private int id;
     private String job_name;
     private String cron_expression;
     private boolean enabled;
     @Enumerated(EnumType.STRING)
     private Reminderperiod remindertype;
     private LocalDateTime  LastRunAt;
     private LocalDateTime nextRunAt;
     @OneToMany(mappedBy = "scheduler",cascade = CascadeType.ALL)
     @JsonIgnore
     private List<JobExecution> jobs;
}

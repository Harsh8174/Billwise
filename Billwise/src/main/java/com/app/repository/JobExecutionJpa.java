package com.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.models.JobExecution;

public interface JobExecutionJpa extends JpaRepository<JobExecution, Integer> {
	JobExecution findTopBySchedulerIdOrderByIdDesc(int id);

}

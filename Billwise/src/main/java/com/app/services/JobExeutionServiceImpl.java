package com.app.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.models.JobExecution;
import com.app.repository.JobExecutionJpa;
@Service
public class JobExeutionServiceImpl implements JobExecutionService {

	@Autowired
	private JobExecutionJpa dao;
	
	@Override
	public List<JobExecution> getalljobs() {
		return dao.findAll();
	}

}

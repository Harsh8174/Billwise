package com.app.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.models.Admin;
import com.app.repository.Admindao;

@Service
public class AdminServiceImpl implements AdminService {
   @Autowired
	private Admindao dao;
	@Override
	public Admin getadmin(Admin admin) {
		
		return dao.getByUsernameAndPassword(admin.getUsername(), admin.getPassword());
	}

}

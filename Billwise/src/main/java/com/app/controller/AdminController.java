package com.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.models.Admin;
import com.app.models.Invoice;
import com.app.models.JobExecution;
import com.app.models.SchedulerJob;
import com.app.responsedto.Dashboardresponsedto;
import com.app.services.AdminService;
import com.app.services.InvoiceService;
import com.app.services.JobExecutionService;
import com.app.services.SchedulerService;

@RestController
@RequestMapping("admin")
@CrossOrigin(origins = "http://localhost:5500",allowCredentials = "true")
public class AdminController {
	@Autowired
	private AdminService service;
	
	
	@PostMapping("login")
     public ResponseEntity<String> login(@RequestBody Admin admin) {
    	 Admin exists = service.getadmin(admin);
    	 System.out.println(exists);
    	 if(exists!=null) {
    		return ResponseEntity.ok("Login Successful");
    	 }else {
    		return  ResponseEntity.notFound().build();
    	 }
     }
	
	@GetMapping("dashboard")
	public Dashboardresponsedto sendresponse() {
		
		return service.sendresponse();
	}
	
}

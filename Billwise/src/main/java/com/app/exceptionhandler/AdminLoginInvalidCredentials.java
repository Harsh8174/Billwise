package com.app.exceptionhandler;

public class AdminLoginInvalidCredentials extends RuntimeException{

	    public AdminLoginInvalidCredentials(String message) {
	          super(message);    	
	    }
	    
}

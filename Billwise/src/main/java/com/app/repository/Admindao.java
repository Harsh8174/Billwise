package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.models.Admin;

public interface Admindao extends JpaRepository<Admin, Integer> {
    Admin getByUsernameAndPassword(String username ,String password);
}

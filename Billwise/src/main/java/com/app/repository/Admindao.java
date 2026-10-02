package com.app.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.models.Admin;

public interface Admindao extends JpaRepository<Admin, Integer> {
    Optional<Admin> getByUsernameAndPassword(String username ,String password);
}

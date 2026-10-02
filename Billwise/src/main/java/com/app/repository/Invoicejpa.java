package com.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.models.Invoice;

public interface Invoicejpa extends JpaRepository<Invoice, Integer> {
       Invoice getInvoiceById(int id);
}

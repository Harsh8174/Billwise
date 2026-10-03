package com.app.Invoice_testing;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import com.app.enums.InvoiceStatus;
import com.app.models.Invoice;
import com.app.repository.Invoicejpa;

@DataJpaTest
@ActiveProfiles("test")
public class InvoiceRespositoryTest {
	@Autowired
    private Invoicejpa invoiceRepository;

	
	@Test
	void getallTesting() {

	    Invoice invoice = new Invoice();

	    invoice.setInvoice_number("INV-101");
	    invoice.setCreated_at(Instant.now());
	    invoice.setInvoice_due_date(LocalDate.now());
	    invoice.setInvoice_status(InvoiceStatus.NEW);

	    Invoice saved = invoiceRepository.save(invoice);

	    System.out.println("Saved ID : " + saved.getId());

	    List<Invoice> list = invoiceRepository.findAll();

	    System.out.println("Total invoices : " + list.size());

	    for (Invoice i : list) {
	        System.out.println("Invoice number : " + i.getInvoice_number());
	        System.out.println("Invoice id : " + i.getId());
	    }

	    assertNotNull(saved.getId());
	    assertEquals(1, list.size());
	}
}

package com.app.services;

import java.util.List;

import org.springframework.web.bind.annotation.PathVariable;

import com.app.enums.InvoiceStatus;
import com.app.models.Invoice;
import com.app.requestdto.Invoicestatusdto;
import com.app.responsedto.Invoicedto;

public interface InvoiceService {
   public Invoice addinvoice(Invoice invoice);
   public List<Invoice> getallInvoices();
   Invoice getInvoiceById(int id);
   public void UpdateInvoiceStatus();
   public Invoicedto changestatus(@PathVariable int id);
   public Invoicedto updatestatus(int id,InvoiceStatus status);
}

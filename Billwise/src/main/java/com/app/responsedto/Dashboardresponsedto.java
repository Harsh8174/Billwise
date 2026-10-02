package com.app.responsedto;

import java.util.List;

import com.app.models.Invoice;
import com.app.models.JobExecution;
import com.app.models.ReminderAttempt;
import com.app.models.SchedulerJob;

import lombok.Data;
@Data
public class Dashboardresponsedto {
//      public int invoices;
//      public List<SchedulerJob> job;
//      public List<Jobexecutionresponse> jobs;
	    public List<Invoicedto> invoice_list;
	    public List<Scheduler_Job_dto> job_list;
	    public List<Jobexecutionresponse> execution_list;
	    public List<ReminderAttemptdto> reminder_list;
}

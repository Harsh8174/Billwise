INSERT INTO scheduler_job(job_name,cron_expression,enabled,remindertype,last_run_at,next_run_at)

values
('DueToday_Reminder_Job','5 * * * * *',false,'Due_Today',null,null),
('Overdue_Reminder_Job','5 * * * * *',false,'Overdued',null,null),
('Upcoming_Reminder_Job','5 * * * * *',false,'Upcoming',null,null);
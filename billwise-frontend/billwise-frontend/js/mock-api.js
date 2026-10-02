/* ==========================================================================
   BillWise — Mock API layer
   --------------------------------------------------------------------------
   This file stands in for your Spring Boot REST backend so the frontend is
   clickable right now. Every function here mirrors a real endpoint:

     BillWiseAPI.login(...)              -> POST /api/auth/login
     BillWiseAPI.getCustomers()          -> GET  /api/customers
     BillWiseAPI.createCustomer(...)     -> POST /api/customers
     BillWiseAPI.getInvoices(...)        -> GET  /api/invoices
     BillWiseAPI.getInvoice(id)          -> GET  /api/invoices/{id}
     BillWiseAPI.createInvoice(...)      -> POST /api/invoices (takes customerId)
     BillWiseAPI.markPaid(id)            -> POST /api/invoices/{id}/mark-paid
     BillWiseAPI.setStatus(id, status)   -> PATCH /api/invoices/{id}/status
     BillWiseAPI.getJobs()               -> GET  /api/jobs
     BillWiseAPI.toggleJob(id, enabled)  -> PATCH /api/jobs/{id}
     BillWiseAPI.runJobNow(id)           -> POST /api/jobs/{id}/run-now
     BillWiseAPI.getDashboardStats()     -> GET  /api/dashboard

   Swap the body of each function for a fetch() call against your Spring
   controllers and every page keeps working unchanged, since pages only
   ever talk to window.BillWiseAPI.
   ========================================================================== */
(function () {
  const STORE_KEY = "billwise_mock_db_v1";
  const TODAY = new Date("2026-09-06"); // matches the case study's sample scenario

  function daysBetween(a, b) {
    const ms = new Date(b) - new Date(a);
    return Math.round(ms / 86400000);
  }

  function seed() {
    return {
      admin: { username: "admin", password: "admin123" },
      customers: [
        { id: 1, name: "Aarav Sharma", email: "aarav@example.com" },
        { id: 2, name: "Diya Patel", email: "diya@example.com" },
        { id: 3, name: "Kabir Shah", email: "kabir@example.com" },
        { id: 4, name: "Meera Joshi", email: "meera@example.com" },
        { id: 5, name: "Rohan Mehta", email: "rohan@example.com" },
      ],
      invoices: [
        { id: 1, number: "INV-1001", customerId: 1, invoiceDate: "2026-09-01", dueDate: "2026-09-07", amount: 12500, status: "PENDING", description: "Ceramic floor tiles — Batch 4", createdAt: "2026-09-01T09:12:00", updatedAt: "2026-09-01T09:12:00" },
        { id: 2, number: "INV-1002", customerId: 2, invoiceDate: "2026-09-02", dueDate: "2026-09-08", amount: 8000, status: "PENDING", description: "Glazed wall tiles", createdAt: "2026-09-02T11:00:00", updatedAt: "2026-09-02T11:00:00" },
        { id: 3, number: "INV-1003", customerId: 3, invoiceDate: "2026-09-05", dueDate: "2026-09-15", amount: 22000, status: "PENDING", description: "Showroom order — bulk", createdAt: "2026-09-05T15:40:00", updatedAt: "2026-09-05T15:40:00" },
        { id: 4, number: "INV-1004", customerId: 4, invoiceDate: "2026-08-25", dueDate: "2026-09-05", amount: 6500, status: "OVERDUE", description: "Repair batch — replacement tiles", createdAt: "2026-08-25T10:05:00", updatedAt: "2026-09-06T08:00:00" },
        { id: 5, number: "INV-1005", customerId: 5, invoiceDate: "2026-08-10", dueDate: "2026-08-20", amount: 15200, status: "PAID", description: "Q3 restock order", createdAt: "2026-08-10T09:00:00", updatedAt: "2026-08-19T14:22:00" },
      ],
      jobs: [
        { id: 1, name: "Upcoming reminder", period: "UPCOMING", daysOffset: -1, frequency: "DAILY", daysOfWeek: [1], dayOfMonth: 1, hour: 9, minute: 0, meridiem: "AM", cronLabel: "Daily at 9:00 AM", enabled: true, lastRunAt: "2026-09-06T09:00:00", nextRunAt: "2026-09-07T09:00:00" },
        { id: 2, name: "Due-today reminder", period: "DUE_TODAY", daysOffset: 0, frequency: "DAILY", daysOfWeek: [1], dayOfMonth: 1, hour: 9, minute: 0, meridiem: "AM", cronLabel: "Daily at 9:00 AM", enabled: true, lastRunAt: "2026-09-06T09:00:00", nextRunAt: "2026-09-07T09:00:00" },
        { id: 3, name: "Overdue reminder", period: "OVERDUE", daysOffset: 1, frequency: "DAILY", daysOfWeek: [1], dayOfMonth: 1, hour: 5, minute: 0, meridiem: "PM", cronLabel: "Daily at 5:00 PM", enabled: true, lastRunAt: "2026-09-06T09:00:00", nextRunAt: "2026-09-06T17:00:00" },
      ],
      jobExecutions: [
        { id: 1, jobId: 3, jobName: "Overdue reminder", trigger: "SCHEDULED", startedAt: "2026-09-06T09:00:00", completedAt: "2026-09-06T09:00:04", found: 1, processed: 1, succeeded: 1, failed: 0, skipped: 0, status: "COMPLETED" },
        { id: 2, jobId: 1, jobName: "Upcoming reminder", trigger: "SCHEDULED", startedAt: "2026-09-06T09:00:00", completedAt: "2026-09-06T09:00:02", found: 1, processed: 1, succeeded: 1, failed: 0, skipped: 0, status: "COMPLETED" },
        { id: 3, jobId: 2, jobName: "Due-today reminder", trigger: "SCHEDULED", startedAt: "2026-09-06T09:00:00", completedAt: "2026-09-06T09:00:01", found: 0, processed: 0, succeeded: 0, failed: 0, skipped: 0, status: "COMPLETED" },
      ],
      reminderAttempts: [
        { id: 1, invoiceId: 4, jobExecutionId: 1, period: "OVERDUE", attemptedAt: "2026-09-06T09:00:02", status: "SUCCESS", detail: "Sent to meera@example.com" },
        { id: 2, invoiceId: 1, jobExecutionId: 2, period: "UPCOMING", attemptedAt: "2026-09-06T09:00:01", status: "SUCCESS", detail: "Sent to aarav@example.com" },
      ],
      nextInvoiceId: 6,
      nextCustomerId: 6,
    };
  }

  function load() {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const fresh = seed();
      localStorage.setItem(STORE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    return JSON.parse(raw);
  }
  function save(db) { localStorage.setItem(STORE_KEY, JSON.stringify(db)); }
  function delay(ms) { return new Promise((res) => setTimeout(res, ms)); }
  function computeLiveStatus(inv) {
    // Status is Admin-set per the spec — this only annotates "days" info, never overrides status.
    return daysBetween(TODAY, inv.dueDate);
  }
  function joinCustomer(invoice, db) {
    const customer = db.customers.find((c) => c.id === invoice.customerId);
    return {
      ...invoice,
      customerName: customer ? customer.name : "—",
      customerEmail: customer ? customer.email : "",
      daysToDue: computeLiveStatus(invoice),
    };
  }

  const BillWiseAPI = {
    TODAY_ISO: TODAY.toISOString().slice(0, 10),

    async login(username, password) {
      await delay(400);
      const db = load();
      if (username === db.admin.username && password === db.admin.password) {
        sessionStorage.setItem("billwise_session", "1");
        return { ok: true };
      }
      return { ok: false, error: "Incorrect username or password." };
    },

    isAuthed() {
      return sessionStorage.getItem("billwise_session") === "1";
    },

    logout() {
      sessionStorage.removeItem("billwise_session");
    },

    async getDashboardStats() {
      await delay(250);
      const db = load();
      const invoices = db.invoices;
      const dueToday = invoices.filter((i) => i.status !== "PAID" && i.dueDate === this.TODAY_ISO).length;
      const tomorrow = new Date(TODAY); tomorrow.setDate(tomorrow.getDate() + 1);
      const dueTomorrow = invoices.filter((i) => i.status !== "PAID" && i.dueDate === tomorrow.toISOString().slice(0, 10)).length;
      const overdue = invoices.filter((i) => i.status === "OVERDUE").length;
      const failedReminders = db.reminderAttempts.filter((r) => r.status === "FAILED").length;
      const recentRuns = [...db.jobExecutions].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt)).slice(0, 5);
      return {
        totalInvoices: invoices.length,
        dueToday, dueTomorrow, overdue, failedReminders,
        recentRuns,
      };
    },

    async getInvoices({ status = "ALL", search = "" } = {}) {
      await delay(250);
      const db = load();
      let list = db.invoices.map((i) => joinCustomer(i, db));
      if (status !== "ALL") list = list.filter((i) => i.status === status);
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        list = list.filter((i) => i.number.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q));
      }
      return list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    },

    async getInvoice(id) {
      await delay(200);
      const db = load();
      const invoice = db.invoices.find((i) => i.id === Number(id));
      if (!invoice) return null;
      const history = db.reminderAttempts
        .filter((r) => r.invoiceId === invoice.id)
        .sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt));
      return { ...joinCustomer(invoice, db), history };
    },

    async getCustomers() {
      await delay(150);
      const db = load();
      return [...db.customers].sort((a, b) => a.name.localeCompare(b.name));
    },

    async createCustomer(payload) {
      await delay(250);
      const db = load();
      const customer = {
        id: db.nextCustomerId++,
        name: payload.name,
        email: payload.email,
      };
      db.customers.push(customer);
      save(db);
      return customer;
    },

    async createInvoice(payload) {
      await delay(300);
      const db = load();
      if (!payload.customerId) throw new Error("An invoice must have a customer.");
      const invoice = {
        id: db.nextInvoiceId++,
        number: payload.number,
        customerId: Number(payload.customerId),
        invoiceDate: payload.invoiceDate,
        dueDate: payload.dueDate,
        amount: Number(payload.amount),
        status: "NEW",
        description: payload.description || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.invoices.push(invoice);
      save(db);
      return invoice;
    },

    async setStatus(id, status) {
      await delay(250);
      const db = load();
      const invoice = db.invoices.find((i) => i.id === Number(id));
      if (!invoice) throw new Error("Invoice not found");
      if (invoice.status === "PAID") throw new Error("Invoice is already PAID and cannot change status.");
      invoice.status = status;
      invoice.updatedAt = new Date().toISOString();
      save(db);
      return invoice;
    },

    async markPaid(id) {
      await delay(300);
      const db = load();
      const invoice = db.invoices.find((i) => i.id === Number(id));
      if (!invoice) throw new Error("Invoice not found");
      invoice.status = "PAID";
      invoice.updatedAt = new Date().toISOString();
      save(db);
      return invoice;
    },

    async getJobs() {
      await delay(200);
      const db = load();
      return db.jobs;
    },

    async toggleJob(id, enabled) {
      await delay(200);
      const db = load();
      const job = db.jobs.find((j) => j.id === Number(id));
      if (!job) throw new Error("Job not found");
      job.enabled = enabled;
      save(db);
      return job;
    },

    // schedule: { frequency: "DAILY"|"WEEKLY"|"MONTHLY", daysOfWeek: [0-6],
    //             dayOfMonth: 1-31, hour: 1-12, minute: 0|15|30|45,
    //             meridiem: "AM"|"PM", cronLabel: display string }
    async updateJobSchedule(id, schedule) {
      await delay(200);
      const db = load();
      const job = db.jobs.find((j) => j.id === Number(id));
      if (!job) throw new Error("Job not found");
      Object.assign(job, schedule);
      save(db);
      return job;
    },

    async getJobHistory(jobId) {
      await delay(200);
      const db = load();
      return db.jobExecutions
        .filter((e) => e.jobId === Number(jobId))
        .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
    },

    // Simulates the full reminder-processing pipeline shown in the
    // architecture diagram: fetch eligible invoices -> for each, check
    // for an existing ReminderAttempt for this invoice+period (the DB
    // unique-constraint check) -> send or skip -> record JobExecution.
    async runJobNow(jobId) {
      await delay(600);
      const db = load();
      const job = db.jobs.find((j) => j.id === Number(jobId));
      if (!job) throw new Error("Job not found");

      const eligible = db.invoices.filter((inv) => {
        if (inv.status === "PAID") return false;
        const offset = daysBetween(TODAY, inv.dueDate);
        if (job.period === "UPCOMING") return offset === 1 && inv.status === "PENDING";
        if (job.period === "DUE_TODAY") return offset === 0;
        if (job.period === "OVERDUE") return offset < 0 || inv.status === "OVERDUE";
        return false;
      });

      let succeeded = 0, failed = 0, skipped = 0;
      const execution = {
        id: db.jobExecutions.length + 1,
        jobId: job.id,
        jobName: job.name,
        trigger: "MANUAL_RUN_NOW",
        startedAt: new Date().toISOString(),
        status: "RUNNING",
      };

      eligible.forEach((inv) => {
        const alreadySent = db.reminderAttempts.some(
          (r) => r.invoiceId === inv.id && r.period === job.period && r.status === "SUCCESS"
        );
        if (alreadySent) {
          skipped++;
          db.reminderAttempts.push({
            id: db.reminderAttempts.length + 1, invoiceId: inv.id, jobExecutionId: execution.id,
            period: job.period, attemptedAt: new Date().toISOString(), status: "SKIPPED",
            detail: "Duplicate blocked by unique constraint (invoice_id, reminder_period)",
          });
          return;
        }
        db.reminderAttempts.push({
          id: db.reminderAttempts.length + 1, invoiceId: inv.id, jobExecutionId: execution.id,
          period: job.period, attemptedAt: new Date().toISOString(), status: "SUCCESS",
          detail: `Sent to ${inv.customerEmail}`,
        });
        succeeded++;
      });

      execution.completedAt = new Date().toISOString();
      execution.found = eligible.length;
      execution.processed = eligible.length;
      execution.succeeded = succeeded;
      execution.failed = failed;
      execution.skipped = skipped;
      execution.status = "COMPLETED";

      job.lastRunAt = execution.startedAt;
      db.jobExecutions.push(execution);
      save(db);
      return execution;
    },
  };

  window.BillWiseAPI = BillWiseAPI;
})();

/* ==========================================================================
   BillWise — Live API layer, matched to your ACTUAL backend response shape
   --------------------------------------------------------------------------
   Your backend returns everything (invoices, jobs, executions, reminders)
   from ONE combined endpoint, shaped like Dashboardresponsedto:
     { execution_list, inovice_list, job_list, reminder_list }

   HOW THIS FILE WORKS:
   1. fetchAll() calls that ONE endpoint and caches the raw response.
   2. A small "normalize" function per entity translates your backend's
      real field names (Invoice_number, invoice_status, remindertype...)
      into the clean names every HTML page already expects (number, status,
      period...). This is the ONLY place that needs to know your backend's
      actual field names — nothing in the HTML files changes.
   3. Every getX() function below just reads from that cached, normalized
      data. Any action (markPaid, runJobNow, etc.) clears the cache so the
      next read re-fetches fresh data.

   ⚠️ FILL THIS IN — the one thing I don't know:
   ========================================================================== */
  const DASHBOARD_ENDPOINT = "/admin/dashboard";

(function () {
  const API_BASE = "http://localhost:8080"; // matches what you're already using
  const TOKEN_KEY = "billwise_token";
  const AUTH_FLAG = "billwise_authed";

  async function request(path, { method = "GET", body } = {}) {
    const headers = { "Content-Type": "application/json" };
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (token) headers["Authorization"] = "Bearer " + token;

    let res;
    try {
      res = await fetch(API_BASE + path, {
        method, headers, credentials: "include",
        body: body !== undefined ? JSON.stringify(body) : undefined,
      });
    } catch (networkErr) {
      throw new Error("Could not reach the server. Is the backend running at " + API_BASE + "?");
    }
    console.log(res);
    if (res.status === 403) {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(AUTH_FLAG);
      if (!path.includes("/login")) window.location.href = "login.html";
      throw new Error("Your session has expired. Please sign in again.");
    }
 if (res.status === 401){
    const text = await res.text();
    let data = null;
    if (text) { try { data = JSON.parse(text); } catch { data = text; } }
    if (!res.ok) {
      const message = (data && (data.message || data.error)) || `Request failed (${res.status})`;
      throw new Error(message);
    }
    return data;
  }
const text = await res.text();
    let data = null;
    if (text) { try { data = JSON.parse(text); } catch { data = text; } }
    if (!res.ok) {
      const message = (data && (data.message || data.error)) || `Request failed (${res.status})`;
      throw new Error(message);
    }
    return data;

  }

  /* ---------------- Normalizers: backend shape -> frontend shape ---------------- */

  // "Overdued" / "Due_Today" / "Upcoming" -> "OVERDUE" / "DUE_TODAY" / "UPCOMING"
  const PERIOD_MAP = { Overdued: "OVERDUE", Due_Today: "DUE_TODAY", Upcoming: "UPCOMING" };
  function mapPeriod(raw) { return PERIOD_MAP[raw] || raw; }

  const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  function ordinal(n) {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }
  function formatHourMinute(h, m) {
    const meridiem = h >= 12 ? "PM" : "AM";
    let hour12 = h % 12; if (hour12 === 0) hour12 = 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${meridiem}`;
  }

  // Translates a raw Spring cron string ("second minute hour day month weekday")
  // into a readable label for display. Falls back to showing the raw cron
  // string for anything more complex than a simple daily/weekly/monthly pattern.
  function humanizeCron(cron) {
    if (!cron) return "No schedule set";
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 6) return cron;
    const [, min, hour, day, , weekday] = parts;

    if (min === "*" || hour === "*") {
      // e.g. "0 * * * * *" — fires every minute, a testing cron, not a real schedule
      return "Every minute (test schedule — set a real time before submitting)";
    }

    const timeLabel = formatHourMinute(Number(hour), Number(min));
    if (day !== "*" && weekday === "*") return `Monthly on the ${ordinal(Number(day))} at ${timeLabel}`;
    if (weekday !== "*" && day === "*") {
      const days = weekday.split(",").map((d) => DOW[Number(d)]).join(", ");
      return `Weekly on ${days} at ${timeLabel}`;
    }
    if (day === "*" && weekday === "*") return `Daily at ${timeLabel}`;
    return cron; // unusual combination — just show the raw cron rather than guess wrong
  }

  function normalizeInvoice(raw) {
    return {
      id: raw.id,
      number: raw.Invoice_number,
      customerId: raw.customer?.id ?? null,
      customerName: raw.customer?.name ?? "",
      customerEmail: raw.customer?.email ?? "",
      invoiceDate: raw.Invoice_date,
      dueDate: raw.Invoice_due_date,
      amount: raw.Invoice_amount,
      status: raw.invoice_status, // backend already sends OVERDUE/DUE/PENDING/PAID — matches pill classes as-is
      description: raw.description ?? "",
      createdAt: raw.created_at ?? null,
      updatedAt: raw.updated_at ?? null,
    };
  }

  function normalizeJob(raw) {
    return {
      id: raw.id,
      name: raw.job_name,
      period: mapPeriod(raw.remindertype),
      enabled: raw.enabled,
      cron: raw.cron_expression,        // raw value, kept in case you need it
      cronLabel: humanizeCron(raw.cron_expression), // human-readable for display
      lastRunAt: raw.LastRunAt ?? null,
      nextRunAt: raw.nextRunAt ?? null,
    };
  }

  function normalizeExecution(raw) {
    return {
      id: raw.id,
      jobId: raw.scheduler_id,
      // Real job name/period now available since the backend added the
      // `scheduler` field back to JobExecution's JSON — reading it directly.
      // jobName: raw.scheduler
      //   ? `${raw.scheduler.job_name} (${mapPeriod(raw.scheduler.remindertype)})`
      //   : "—",
      jobName:raw.schduler_job_name,
      period: mapPeriod(raw.remindertype),
      trigger: raw.trigger, // still not present in your backend response yet
      startedAt: raw.started_at,
      completedAt: raw.ended_at,
      found: raw.found,
      succeeded: raw.sent,
      failed: raw.failed,
      skipped: raw.skipped,
    };
  }

  function normalizeReminder(raw) {
    return {
      id: raw.id,
      invoiceId: raw.invoice_id,
      period: mapPeriod(raw.remainderperiod),
      attemptedAt: raw.attemptedAt, // backend only stores a date, not a timestamp — see note below
      status: raw.status?.toUpperCase() === "SUCCESS" ? "SUCCESS" : "FAILED",
      detail: "",
    };
  }

  /* ---------------- Cached fetch of the one combined endpoint ---------------- */

  let cache = null; // { invoices, jobs, executions, reminders }

  async function fetchAll(force = false) {
    if (cache && !force) return cache;
    const raw = await request(DASHBOARD_ENDPOINT);
    console.log(raw.invoice_list);
    console.log(raw.job_list );
    console.log(raw.execution_list);
    console.log(raw.reminder_list);
    cache = {
      invoices: (raw.invoice_list || []).map(normalizeInvoice),
      jobs: (raw.job_list || []).map(normalizeJob),
      executions: (raw.execution_list || []).map(normalizeExecution),
      reminders: (raw.reminder_list || []).map(normalizeReminder),
    };
    return cache;
  }

  function invalidate() { cache = null; }

  function daysBetween(a, b) {
    const start = new Date(a); start.setHours(0, 0, 0, 0);
    const end = new Date(b); end.setHours(0, 0, 0, 0);
    return Math.round((end - start) / 86400000);
  }

  const BillWiseAPI = {
    TODAY_ISO: new Date().toISOString().slice(0, 10),

    async login(username, password) {
      try {
        const data = await request("/admin/login", { method: "POST", body: { username, password } });
        if (data && data.token) sessionStorage.setItem(TOKEN_KEY, data.token);
        sessionStorage.setItem(AUTH_FLAG, "1");
        return { ok: true };
      } catch (err) {
        console.log(err.message);
        return { ok: false, error: err.message || "Incorrect username or password." };
      }
    },

    isAuthed() { return sessionStorage.getItem(AUTH_FLAG) === "1"; },

    async logout() {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(AUTH_FLAG);
      invalidate();
    },

    async getDashboardStats() {
      const { invoices, executions, reminders } = await fetchAll();
      const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowISO = tomorrow.toISOString().slice(0, 10);

      return {
        totalInvoices: invoices.length,
        dueToday: invoices.filter((i) => i.status === "DUE").length,
        dueTomorrow: invoices.filter((i) => i.status !== "PAID" && i.dueDate === tomorrowISO).length,
        overdue: invoices.filter((i) => i.status === "OVERDUE").length,
        failedReminders: reminders.filter((r) => r.status === "FAILED").length,
        recentRuns: [...executions].sort((a, b) => (b.startedAt || "").localeCompare(a.startedAt || "")).slice(0, 5),
      };
    },

    async getInvoices({ status = "ALL", search = "" } = {}) {
      const { invoices } = await fetchAll();
      let list = invoices.map((inv) => ({ ...inv, daysToDue: daysBetween(new Date(), inv.dueDate) }));
      if (status !== "ALL") list = list.filter((i) => i.status === status);
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        list = list.filter((i) => i.number.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q));
      }
      return list.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    },

    async getInvoice(id) {
      const { invoices, reminders } = await fetchAll();
      const invoice = invoices.find((i) => i.id === Number(id));
      if (!invoice) return null;
      const history = reminders
        .filter((r) => r.invoiceId === Number(id))
        .sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt));
      return { ...invoice, daysToDue: daysBetween(new Date(), invoice.dueDate), history };
    },

    async getCustomers() {
      try {
        const raw = await request("/customer/get/all");
        return raw.map((c) => ({ id: c.id, name: c.name, email: c.email }));
      } catch (err) {
        const { invoices } = await fetchAll();
        const seen = new Map();
        invoices.forEach((inv) => {
          if (inv.customerId != null && !seen.has(inv.customerId)) {
            seen.set(inv.customerId, { id: inv.customerId, name: inv.customerName, email: inv.customerEmail });
          }
        });
        return [...seen.values()].sort((a, b) => a.name.localeCompare(b.name));
      }
    },

    async createCustomer(payload) {
      const result = await request("/customer/add", { method: "POST", body: payload });
      invalidate();
      return { id: result.id, name: result.name, email: result.email };
    },

    async createInvoice(payload) {
      // payload includes customerId (from getCustomers()/createCustomer()).
      // ⚠️ CONFIRM your @PostMapping DTO accepts customerId as a plain field
      // rather than a nested customer object.
      const result = await request("/invoice/add", { method: "POST", body: payload });
      invalidate();
      return result;
    },

    async setStatus(id, status) {
      
      const result = await request(`/invoice/setStatus/${id}`, { method: "PATCH", body: { status } });
      invalidate();
      return result;
    },

    async markPaid(id) {
     
      const result = await request(`/invoice/markPaid/${id}`, { method: "POST" });
      invalidate();
      return result;
    },

    async getJobs() {
      const { jobs } = await fetchAll();
      return jobs;
    },


    async createJob(period, schedule = {}) {
      const REVERSE_PERIOD_MAP = { OVERDUE: "Overdued", DUE_TODAY: "Due_Today", UPCOMING: "Upcoming" };
      const hour = schedule.hour || 9;
      const minute = schedule.minute ?? 0;
      const meridiem = schedule.meridiem || "AM";
      const hour24 = meridiem === "PM" && hour !== 12 ? hour + 12 : meridiem === "AM" && hour === 12 ? 0 : hour;
      const time = `${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;

      const result = await request("/schedule/add", {
        method: "POST",
        body: {
          frequency: "daily",
          time,
          enabled: true,
          reminder_type: REVERSE_PERIOD_MAP[period],
        },
      });
      invalidate();
      return result;
    },

    async toggleJob(id, enabled) {
      const result = await request(`/schedule/enable/${id}`, { method: "PATCH", body: { enabled } });
      invalidate();
      return result;
    },

    async updateJobSchedule(id, schedule) {

      const hour24 = schedule.meridiem === "PM" && schedule.hour !== 12
                    ? schedule.hour + 12
                    : schedule.meridiem === "AM" && schedule.hour === 12
                    ? 0
                    : schedule.hour;
      const localTime = `${String(hour24).padStart(2, "0")}:${String(schedule.minute).padStart(2, "0")}:00`;

      const result = await request(`/schedule/job/${id}`, {
        method: "PATCH",
        body: { time: localTime },
      });
      invalidate();
      return result;
    },

    async getJobHistory(jobId) {
      // Now filterable — each execution carries its real scheduler.id.
      const { executions } = await fetchAll();
      console.log("execution history");
      console.log(executions);
      return executions
        .filter((e) => e.jobId === Number(jobId))
        .sort((a, b) => (b.startedAt || "").localeCompare(a.startedAt || ""));
    },

    async runJobNow(jobId) {

      console.log("jobId :" +jobId );
      const raw = await request(`/schedule/runNow/${jobId}`, { method: "POST" });
      invalidate();
      console.log("raw    "+raw);
      return normalizeExecution(raw);
    },
  };

  window.BillWiseAPI = BillWiseAPI;
})();

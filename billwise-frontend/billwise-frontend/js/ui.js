
(function () {
  function requireAuth() {
    if (!window.BillWiseAPI.isAuthed()) {
      window.location.href = "login.html";
    }
  }

  function toast(message, type = "info") {
    let host = document.getElementById("toast-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "toast-host";
      document.body.appendChild(host);
    }
    const el = document.createElement("div");
    el.className = "toast" + (type === "error" ? " toast-error" : "");
    el.textContent = message;
    host.appendChild(el);
    setTimeout(() => el.remove(), 3400);
  }

  function statusPillClass(status) {
    return {
      NEW: "pill-new", PENDING: "pill-pending", DUE: "pill-due",
      OVERDUE: "pill-overdue", PAID: "pill-paid",
      SUCCESS: "pill-success", FAILED: "pill-failed", SKIPPED: "pill-skipped",
    }[status] || "pill-new";
  }

  function statusPillHtml(status) {
    return `<span class="pill ${statusPillClass(status)}">${status}</span>`;
  }

  function formatDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  function formatDateTime(iso) {
    if (!iso) return "—";

    if (/^\d{2}:\d{2}(:\d{2})?$/.test(iso)) {
      const [h, m] = iso.split(":").map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    }
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso; 
    return d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  function formatCurrency(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
  }

  function dueDateLabel(inv) {
    if (inv.status === "PAID") return formatDate(inv.dueDate);
    const days = inv.daysToDue;
    if (days === 0) return formatDate(inv.dueDate) + " · due today";
    if (days === 1) return formatDate(inv.dueDate) + " · due tomorrow";
    if (days < 0) return formatDate(inv.dueDate) + ` · ${Math.abs(days)}d overdue`;
    return formatDate(inv.dueDate);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function initials(name) {
    return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  }

  function wireLogout(selector) {
    const btn = document.querySelector(selector);
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        window.BillWiseAPI.logout();
        window.location.href = "login.html";
      });
    }
  }

  window.UI = {
    requireAuth, toast, statusPillHtml, statusPillClass,
    formatDate, formatDateTime, formatCurrency, dueDateLabel,
    escapeHtml, initials, wireLogout,
  };
})();

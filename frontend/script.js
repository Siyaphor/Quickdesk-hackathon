console.log("Hello from Nandni - UI tested!");

const form = document.getElementById("ticketForm");
const ticketDisplay = document.getElementById("ticketDisplay");
const STORAGE_KEY = "tickets_quickdesk";

// status cycle order
const STATUS_CYCLE = ["Open", "In Progress", "Closed"];

// load and render existing tickets
document.addEventListener("DOMContentLoaded", () => {
  const tickets = getTickets();
  tickets.forEach((t) => displayTicket(t, true));
});

function getTickets() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTickets(tickets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const subject = document.getElementById("subject").value.trim();
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value.trim();

  if (subject.length < 5) {
    alert("Subject must be at least 5 characters.");
    return;
  }
  if (description.length < 10) {
    alert("Description must be at least 10 characters.");
    return;
  }
  if (!category) {
    alert("Please select a category.");
    return;
  }

  const ticket = {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    subject,
    category,
    description,
    status: "Open",
    createdAt: new Date().toISOString(),
  };

  // prepend new ticket
  displayTicket(ticket);
  const tickets = getTickets();
  tickets.unshift(ticket);
  saveTickets(tickets);

  form.reset();
});

// render one ticket into the list
function displayTicket(ticket, skipSave = false) {
  // if no tickets placeholder exists, remove it
  const existingNo = document.querySelector("#ticketDisplay .no-tickets");
  if (existingNo) existingNo.remove();

  const li = document.createElement("li");
  li.className = "ticket-card";

  const info = document.createElement("div");
  info.className = "ticket-info";
  info.innerHTML = `
    <div>
      <div class="ticket-subject">${escapeHtml(ticket.subject)}</div>
      <div class="user-display">${escapeHtml(ticket.user || "guest@example.com")}</div>
      <div class="small">${new Date(ticket.createdAt).toLocaleString()}</div>
    </div>
  `;

  const statusBadge = document.createElement("div");
  statusBadge.className = `badge ${ticket.status.replace(/\s+/g, "_").toLowerCase()}`;
  statusBadge.textContent = ticket.status;
  updateBadgeStyle(statusBadge, ticket.status);
  statusBadge.style.cursor = "pointer";

  // cycle status on click
  statusBadge.addEventListener("click", () => {
    const currentIndex = STATUS_CYCLE.indexOf(ticket.status);
    const next = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
    ticket.status = next;
    statusBadge.textContent = ticket.status;
    updateBadgeStyle(statusBadge, ticket.status);
    // persist change
    const all = getTickets();
    const idx = all.findIndex((t) => t.id === ticket.id);
    if (idx !== -1) {
      all[idx] = ticket;
      saveTickets(all);
    }
  });

  li.appendChild(info);
  li.appendChild(statusBadge);

  // insert at top
  ticketDisplay.prepend(li);

  if (!skipSave) {
    const all = getTickets();
    all.unshift(ticket);
    saveTickets(all);
  }
}

function updateBadgeStyle(badge, status) {
  badge.style.padding = "6px 16px";
  badge.style.borderRadius = "999px";
  badge.style.fontSize = ".55rem";
  badge.style.fontWeight = "600";
  badge.style.letterSpacing = "1px";
  if (status === "Open") {
    badge.style.background = "rgba(245,158,11,0.15)";
    badge.style.color = "#f59e0b";
    badge.style.boxShadow = "0 0 14px rgba(245,158,11,0.5)";
  } else if (status === "In Progress") {
    badge.style.background = "rgba(14,165,233,0.15)";
    badge.style.color = "#0ea5e9";
    badge.style.boxShadow = "0 0 14px rgba(14,165,233,0.5)";
  } else if (status === "Closed") {
    badge.style.background = "rgba(16,185,129,0.15)";
    badge.style.color = "#10b981";
    badge.style.boxShadow = "0 0 14px rgba(16,185,129,0.5)";
  }
}

// simple HTML escape
function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// hash password before save
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch summary
    const res = await fetch("http://localhost:5000/api/tickets/admin/summary");
    const summary = await res.json();

    document.getElementById("totalUsers").textContent = summary.totalUsers;
    document.getElementById("openTickets").textContent = summary.openTickets;
    document.getElementById("closedTickets").textContent = summary.closedTickets;

    // Fetch recent tickets
    const ticketRes = await fetch("http://localhost:5000/api/tickets");
    const tickets = await ticketRes.json();

    const ticketRows = document.getElementById("ticketRows");
    ticketRows.innerHTML = "";

    tickets.slice(-5).reverse().forEach(ticket => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${ticket.subject}</td>
        <td>${ticket.user}</td>
        <td>${ticket.category}</td>
        <td>${ticket.status}</td>
      `;
      ticketRows.appendChild(row);
    });
  } catch (err) {
    console.error("Error loading admin data:", err);
  }
});


module.exports = mongoose.models.User || mongoose.model("User", userSchema);

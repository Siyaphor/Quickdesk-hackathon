const Ticket = require("../models/Ticket");

// POST /api/tickets
const createTicket = async (req, res) => {
  try {
    const { subject, description, category, user } = req.body;

    const newTicket = await Ticket.create({
      subject,
      description,
      category,
      user,
      // attachment: not handling files for now
    });

    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: "Failed to create ticket", error: error.message });
  }
};

// GET /api/tickets?user=himanshi123
// GET /api/tickets?user=himanshi123&status=Open&category=Billing
const getTicketsByUser = async (req, res) => {
  try {
    const { user, status, category } = req.query;

    const filter = {};
    if (user) filter.user = user;
    if (status) filter.status = status;
    if (category) filter.category = category;

    const tickets = await Ticket.find(filter);

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tickets", error: error.message });
  }
};

// PATCH /api/tickets/:id
const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(updatedTicket);
  } catch (error) {
    res.status(500).json({ message: "Failed to update ticket", error: error.message });
  }
};
// DELETE /api/tickets/:id
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTicket = await Ticket.findByIdAndDelete(id);

    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete ticket", error: error.message });
  }
};
const User = require("../models/User"); // make sure you have this model

// GET /api/admin/summary
const getAdminSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: "Open" });
    const closedTickets = await Ticket.countDocuments({ status: "Closed" });

    res.json({ totalUsers, openTickets, closedTickets });
  } catch (error) {
    res.status(500).json({ message: "Failed to get summary", error: error.message });
  }
};

module.exports = {
  createTicket,
  getTicketsByUser,
  updateTicketStatus,
  deleteTicket,
  getAdminSummary,
};

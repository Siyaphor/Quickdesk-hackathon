const Ticket = require("../models/Ticket");
const User = require("../models/User"); // ensure this exists

// POST /api/tickets
const createTicket = async (req, res) => {
  try {
    let { subject, description, category, user } = req.body;

    // basic validation
    if (!subject || !description || !category || !user) {
      return res.status(400).json({ message: "Subject, description, category and user are all required." });
    }

    // trim inputs
    subject = subject.trim();
    description = description.trim();
    category = category.trim();
    user = user.trim();

    const newTicket = await Ticket.create({
      subject,
      description,
      category,
      user,
    });

    res.status(201).json(newTicket);
  } catch (error) {
    console.error("createTicket error:", error);
    res.status(500).json({ message: "Failed to create ticket", error: error.message });
  }
};

// GET /api/tickets?user=himanshi123&status=Open&category=Billing
const getTicketsByUser = async (req, res) => {
  try {
    const { user, status, category } = req.query;

    const filter = {};
    if (user) filter.user = user.trim();
    if (status) filter.status = status.trim();
    if (category) filter.category = category.trim();

    const tickets = await Ticket.find(filter);

    res.json(tickets);
  } catch (error) {
    console.error("getTicketsByUser error:", error);
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

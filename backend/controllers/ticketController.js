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
const getTicketsByUser = async (req, res) => {
  try {
    const { user } = req.query;

    const tickets = await Ticket.find({ user });

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tickets", error: error.message });
  }
};

module.exports = { createTicket, getTicketsByUser };

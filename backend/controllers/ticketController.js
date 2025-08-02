const Ticket = require("../models/Ticket");

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

// GET /api/tickets?user=himanshi123
const getTicketsByUser = async (req, res) => {
  try {
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({ message: "Query parameter 'user' is required." });
    }

    const tickets = await Ticket.find({ user: user.trim() });

    res.json(tickets);
  } catch (error) {
    console.error("getTicketsByUser error:", error);
    res.status(500).json({ message: "Failed to fetch tickets", error: error.message });
  }
};

module.exports = { createTicket, getTicketsByUser };

const express = require("express");
const router = express.Router();
const {
  createTicket,
  getTicketsByUser,
} = require("../controllers/ticketController");

// @route   POST /api/tickets
// @desc    Create a new ticket
router.post("/", createTicket);

// @route   GET /api/tickets?user=himanshi123
// @desc    Get all tickets by user
router.get("/", getTicketsByUser);

module.exports = router;

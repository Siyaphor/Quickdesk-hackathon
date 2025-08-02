const express = require("express");
const router = express.Router();
const {
  createTicket,
  getTicketsByUser,
  updateTicketStatus,
  deleteTicket, 
  getAdminSummary,
} = require("../controllers/ticketController");
router.get("/admin/summary", getAdminSummary);
router.post("/", createTicket);
router.get("/", getTicketsByUser);
router.patch("/:id", updateTicketStatus);
router.delete("/:id", deleteTicket);



module.exports = router;

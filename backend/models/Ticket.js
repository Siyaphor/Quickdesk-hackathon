const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    // attachment: String // If you add file upload later
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load .env file
dotenv.config();

// Connect MongoDB
connectDB(); // 🔥 THIS is what actually connects your DB!

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("QuickDesk backend is running 🚀");
});

// Routes (you'll plug them in soon)
app.use("/api/tickets", require("./routes/ticketRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

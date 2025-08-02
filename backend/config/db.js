const mongoose = require("mongoose");

const MAX_RETRIES = 5;
let attempt = 0;

// Default fallback if no MONGO_URI provided
const DEFAULT_LOCAL_URI = "mongodb://localhost:27017/quickdesk";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || DEFAULT_LOCAL_URI;
  if (!process.env.MONGO_URI) {
    console.warn(
      "⚠️  MONGO_URI not set in environment. Falling back to local default:",
      DEFAULT_LOCAL_URI
    );
  }

  const options = {
    serverSelectionTimeoutMS: 5000, // fail fast if server not reachable
    family: 4, // prefer IPv4
    // other defaults from Mongoose 6+ are okay
  };

  const tryConnect = async () => {
    try {
      await mongoose.connect(uri, options);
      console.log("✅ MongoDB Connected");
    } catch (error) {
      attempt++;
      console.error(
        `❌ MongoDB connection failed (attempt ${attempt}):`,
        error.message
      );
      if (attempt < MAX_RETRIES) {
        const delay = 2 ** attempt * 1000; // 2s,4s,8s...
        console.log(`⏳ Retrying connection in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
        return tryConnect();
      }
      console.error("🚨 Exceeded max retries. Exiting process.");
      process.exit(1);
    }
  };

  await tryConnect();
};

// Log connection state changes
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});
mongoose.connection.on("reconnected", () => {
  console.log("♻️ MongoDB reconnected");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB error:", err.message);
});

// Graceful shutdown
const gracefulClose = async () => {
  try {
    await mongoose.connection.close(false);
    console.log("🛑 MongoDB connection closed gracefully");
    process.exit(0);
  } catch (e) {
    console.error("Error during MongoDB shutdown:", e);
    process.exit(1);
  }
};

process.on("SIGINT", gracefulClose);
process.on("SIGTERM", gracefulClose);

module.exports = connectDB;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const bookingRoutes = require("./routes/booking");

const app = express();

// MIDDLEWARES
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ message: "Server is running 🚀", timestamp: new Date().toISOString() });
});

// AUTH ROUTES
app.use("/api/auth", authRoutes);

// BOOKING ROUTES
app.use("/api/bookings", bookingRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 API Documentation:`);
  console.log(`   POST   /api/auth/signup - Register new user`);
  console.log(`   POST   /api/auth/login - Login user`);
  console.log(`   POST   /api/bookings/book - Create booking (Protected)`);
  console.log(`   GET    /api/bookings/my-bookings - Get user bookings (Protected)`);
  console.log(`   GET    /api/bookings/booking/:id - Get booking details (Protected)`);
  console.log(`   PUT    /api/bookings/booking/:id - Update booking (Protected)`);
  console.log(`   DELETE /api/bookings/booking/:id - Cancel booking (Protected)`);
});
  
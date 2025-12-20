const express = require("express");
const { z } = require("zod");
const prisma = require("../utils/prisma");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Validation schema for booking
const bookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Time must be HH:MM"),
  numberOfPeople: z.number().int().min(1, "At least 1 person required").max(10, "Maximum 10 people"),
  specialRequest: z.string().optional()
});

// CREATE BOOKING (No auth required - store with email)
router.post("/book", async (req, res) => {
  try {
    const { name, email, phone, date, time, numberOfPeople, specialRequest } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !date || !time || !numberOfPeople) {
      return res.status(400).json({ 
        error: "Missing required fields: name, email, phone, date, time, numberOfPeople" 
      });
    }

    // Validate date and time format
    if (!date.match(/^\d{4}-\d{2}-\d{2}$/) || !time.match(/^\d{2}:\d{2}$/)) {
      return res.status(400).json({ 
        error: "Invalid date (YYYY-MM-DD) or time (HH:MM) format" 
      });
    }

    if (numberOfPeople < 1 || numberOfPeople > 10) {
      return res.status(400).json({ 
        error: "Number of people must be between 1 and 10" 
      });
    }

    // Create or find user
    let user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Create user without password for direct booking
      user = await prisma.user.create({
        data: {
          name,
          email,
          mobile: phone,
          password: "booking-user" // Placeholder
        }
      });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        date,
        time,
        numberOfPeople,
        specialRequest: specialRequest || null
      }
    });

    res.status(201).json({
      message: "Booking created successfully! We'll contact you soon.",
      booking: {
        id: booking.id,
        date: booking.date,
        time: booking.time,
        numberOfPeople: booking.numberOfPeople,
        status: booking.status,
        createdAt: booking.createdAt
      }
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// GET ALL BOOKINGS FOR LOGGED IN USER (Protected)
router.get("/my-bookings", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      bookings
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// GET BOOKING BY ID (Protected)
router.get("/booking/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Verify ownership
    if (booking.userId !== userId) {
      return res.status(403).json({ error: "Not authorized to view this booking" });
    }

    res.json({ booking });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// UPDATE BOOKING (Protected)
router.put("/booking/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { date, time, numberOfPeople, specialRequest } = bookingSchema.partial().parse(req.body);

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ error: "Not authorized to update this booking" });
    }

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: {
        ...(date && { date }),
        ...(time && { time }),
        ...(numberOfPeople && { numberOfPeople }),
        ...(specialRequest !== undefined && { specialRequest })
      }
    });

    res.json({
      message: "Booking updated successfully",
      booking: updatedBooking
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: err.errors[0].message });
    }
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

// CANCEL BOOKING (Protected)
router.delete("/booking/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Check if booking exists and belongs to user
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) }
    });

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ error: "Not authorized to cancel this booking" });
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      message: "Booking cancelled successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

module.exports = router;

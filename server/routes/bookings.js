import express from "express";
import Booking from "../models/Booking.js";
import Order from "../models/Order.js";

const router = express.Router();

// ✅ Create Booking + Order on "Contact Owner"
router.post("/", async (req, res) => {
  try {
    const { userId, propertyId, ownerId } = req.body;

    if (!userId || !propertyId || !ownerId) {
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    const existingBooking = await Booking.findOne({ user: userId, property: propertyId });
    if (existingBooking) {
      return res.status(400).json({ message: "Booking request already sent." });
    }

    const newBooking = new Booking({
      user: userId,
      property: propertyId,
      owner: ownerId,
      status: "Pending",
    });

    await newBooking.save();

    const newOrder = new Order({
      owner: ownerId,
      user: userId,
      property: propertyId,
      status: "Pending",
    });

    await newOrder.save();

    res.status(201).json({
      message: "✅ Booking request sent successfully!",
      booking: newBooking,
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Error saving booking:", error);
    res.status(500).json({ message: "❌ Server Error", error: error.message });
  }
});

// ✅ Get bookings for renter
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Order.find({ user: userId })
      .populate("property", "title location rent")
      .populate("owner", "name email");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get orders for owner
router.get("/owner/:ownerId", async (req, res) => {
  try {
    const orders = await Order.find({ owner: req.params.ownerId })
      .populate("property", "title location rent")
      .populate("user", "name email");

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "❌ Server Error", error: error.message });
  }
});

export default router;

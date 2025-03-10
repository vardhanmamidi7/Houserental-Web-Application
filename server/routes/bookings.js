import express from "express";
import Booking from "../models/Booking.js";
import Order from "../models/Order.js";

const router = express.Router();

// ✅ Create a new booking & order when "Contact Owner" is clicked
router.post("/", async (req, res) => {
  try {
    console.log("📌 Received Booking Request:", req.body); // Debugging Log

    const { userId, propertyId, ownerId } = req.body;

    if (!userId || !propertyId || !ownerId) {
      console.log("❌ Missing required fields");
      return res.status(400).json({ message: "❌ Missing required fields" });
    }

    // ✅ Check if booking already exists
    const existingBooking = await Booking.findOne({ user: userId, property: propertyId });
    if (existingBooking) {
      console.log("⚠️ Booking already exists for this user and property.");
      return res.status(400).json({ message: "Booking request already sent." });
    }

    // ✅ Create a new booking if no existing one
    const newBooking = new Booking({
      user: userId,
      property: propertyId,
      owner: ownerId,
      status: "Pending",
    });

    await newBooking.save();
    console.log("✅ Booking Created:", newBooking);

    // ✅ Create an order for the owner (only if booking is new)
    const newOrder = new Order({
      owner: ownerId,
      user: userId,
      property: propertyId,
    });

    await newOrder.save();
    console.log("✅ Order Created:", newOrder);

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



// ✅ Fetch bookings for "Your Bookings" page (for renters)
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("📌 Fetching bookings for user:", userId); // Debugging Log

    const bookings = await Booking.find({ user: userId }).populate("property");
    
    if (!bookings || bookings.length === 0) {
      console.log("❌ No bookings found for user:", userId);
      return res.status(404).json({ message: "No bookings found" });
    }

    console.log("✅ Found bookings:", bookings);
    res.json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ✅ Fetch orders for "Orders" page (for owners)
router.get("/owner/:ownerId", async (req, res) => {
  try {
    console.log("📌 Fetching orders for owner:", req.params.ownerId);

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

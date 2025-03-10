import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// ✅ Create a new order
router.post("/", async (req, res) => {
  try {
    console.log("📌 Received Order Data:", req.body);

    const { owner, user, property } = req.body;

    if (!owner || !user || !property) {
      console.error("❌ Missing Required Fields:", { owner, user, property });
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({ owner, user, property });
    await newOrder.save();

    res.status(201).json({ message: "✅ Order created successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Fetch orders for a specific owner
router.get("/owner/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    console.log("📌 Fetching orders for owner:", ownerId);

    const orders = await Order.find({ owner: ownerId })
      .populate("property", "title location rent")
      .populate("user", "name email");

    if (!orders || orders.length === 0) {
      console.log("❌ No orders found for owner:", ownerId);
      return res.status(404).json({ message: "No orders found" });
    }

    console.log("✅ Found Orders:", orders);
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;

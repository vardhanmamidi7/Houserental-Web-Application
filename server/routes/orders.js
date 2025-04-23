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

    const newOrder = new Order({ owner, user, property, status: "Pending" });
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
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Fetch orders for a specific renter (user)
router.get("/renter/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("📌 Fetching orders for renter:", userId);

    const orders = await Order.find({ user: userId })
      .populate("property", "title location rent")
      .populate("owner", "name email");

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching renter orders:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Update order status (Accept/Reject)
router.put("/update-status/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log(`📌 Updating Order ID: ${orderId} ➡️ New Status: ${status}`);

    const validStatuses = ["Accepted", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(orderId).populate("user");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    console.error("❌ Server Error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;

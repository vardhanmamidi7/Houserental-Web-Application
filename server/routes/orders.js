import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("📌 Received Order Data:", req.body); // 🔍 Debugging log

    const { owner, user, property } = req.body;

    if (!owner || !user || !property) {
      console.error("❌ Missing Required Fields:", { owner, user, property });
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({ owner, user, property });
    await newOrder.save();

    res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;

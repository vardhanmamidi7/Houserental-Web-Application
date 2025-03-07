import express from "express";
import Property from "../models/Property.js";

const router = express.Router();

// ✅ Fetch all properties
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Error fetching properties", error });
  }
});

// ✅ Fetch a single house by ID
router.get("/:id", async (req, res) => {
  try {
    console.log("Requested ID:", req.params.id);
    const house = await Property.findById(req.params.id);

    if (!house) {
      return res.status(404).json({ message: "House not found" });
    }

    res.json(house);
  } catch (error) {
    console.error("Error fetching house:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

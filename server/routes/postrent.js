import express from "express";
import multer from "multer";
import Property from "../models/Property.js";

const router = express.Router();

// Multer setup for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Route to handle property posting
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    console.log("📌 Received Data:", req.body); // Debugging
    console.log("📌 Received Files:", req.files); // Debugging

    const { title, description, type, rent, location, capacity, owner } = req.body;

    // Ensure body fields are parsed correctly
    if (!title || !description || !type || !rent || !location || !capacity || !owner) {
      return res.status(400).json({
        message: "❌ Missing required fields",
        missingFields: { title, description, type, rent, location, capacity, owner },
      });
    }

    const rentValue = Number(rent);
    const capacityValue = Number(capacity);

    // Validation checks
    if (capacityValue < 0 || rentValue < 0) {
      return res.status(400).json({ message: "❌ Capacity and Rent cannot be negative." });
    }

    if (capacityValue > 10) {
      return res.status(400).json({ message: "❌ Capacity cannot exceed 10." });
    }
    if (rentValue > 50000) {
      return res.status(400).json({ message: "❌ Rent cannot exceed 50,000." });
    }

    const images = req.files && req.files.length > 0
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const newProperty = new Property({
      title,
      description,
      type,
      rent: rentValue,
      location,
      images,
      capacity: capacityValue,
      owner,
    });

    await newProperty.save();
    res.status(201).json({ message: "✅ Property posted successfully!", property: newProperty });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({ message: "❌ Server Error", error: error.message });
  }
});

export default router;

import express from "express";
import multer from "multer";
import Property from "../models/Property.js";

const router = express.Router();

// Multer setup for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images inside "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage: storage });

router.post("/postrent", upload.array("images", 5), async (req, res) => {
  try {
    const { title, description, type, rent, location, capacity, owner } = req.body;
    
    // 🔴 Check if images were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload at least one image" });
    }

    // Save uploaded image paths
    const images = req.files.map((file) => `/uploads/${file.filename}`);

    const newProperty = new Property({
      title,
      description,
      type,
      rent,
      location,
      images, // Save image URLs
      capacity,
      owner,
    });

    await newProperty.save();
    res.status(201).json({ message: "Property posted successfully", property: newProperty });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

export default router;

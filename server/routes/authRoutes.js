import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, phone, email, password, state, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with role
    const newUser = new User({ name, phone, email, password: hashedPassword, state, role });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});


// ✅ Check if user exists
router.get("/check-user", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ exists: true, message: "User exists" });
    } else {
      return res.status(404).json({ exists: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});


// ✅ Sign-in Route



// ✅ Sign-in Route
router.post("/signin", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Check if the role matches
    if (user.role !== role) {
      return res.status(400).json({ message: "Incorrect role." });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    // after creating or validating user
res.status(200).json({
  message: "Success",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role, // ✅ Add this line
  },
});

    
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;





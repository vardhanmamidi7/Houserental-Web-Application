import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import propertyRoutes from './routes/propertyRoutes.js';
import postRentRoutes from "./routes/postrent.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serves uploaded images


// Routes


app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use('/api', postRentRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

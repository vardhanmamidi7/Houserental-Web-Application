import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  rent: Number,
  location: String,
  capacity: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Make sure this is correct
  images: [String],
  createdAt: { type: Date, default: Date.now }
});

const Property = mongoose.model("Property", propertySchema);
export default Property;

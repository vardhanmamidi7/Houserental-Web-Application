import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, // Added description
  type: { type: String, required: true },
  rent: { type: Number, required: true },
  location: { type: String, required: true },
  images: [{ type: String }], // Will store image URLs
  capacity: { type: Number, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

const Property = mongoose.model('Property', propertySchema);
export default Property;

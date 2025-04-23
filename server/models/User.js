import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  state: { type: String, required: true },
  role: { type: String, required: true, enum: ['Owner', 'Rent-Taking Person'], default: 'Rent-Taking Person' }, // Add the 'role' field
}, { timestamps: true });

export default mongoose.model("User", UserSchema);

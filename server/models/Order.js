import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" }, // ✅ Make sure this exists!
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;

import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Owner of the house
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who contacted
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true }, // House
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);
export default Order;

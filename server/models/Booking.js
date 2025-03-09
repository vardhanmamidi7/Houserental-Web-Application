import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who booked
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true }, // House
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Owner of the house
    status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" }, // Booking status
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;

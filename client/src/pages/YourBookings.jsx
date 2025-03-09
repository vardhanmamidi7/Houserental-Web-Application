import { useState, useEffect } from "react";
import axios from "axios";

const YourBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser._id) {
          console.error("❌ User not found in localStorage.");
          setLoading(false);
          return;
        }

        const userId = storedUser._id;
        console.log("📌 Fetching bookings for user:", userId); // Debugging log
        
        const response = await axios.get(`http://localhost:5001/api/bookings/user/${userId}`);

        console.log("📌 Fetched Bookings Data:", response.data); // Debugging log
        setBookings(response.data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (bookings.length === 0) return <p>No bookings found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Bookings</h2>
      {bookings.map((booking) => (
        <div key={booking._id} className="p-4 bg-gray-800 rounded-lg mb-2">
          <p><strong>Property:</strong> {booking.property?.title || "N/A"}</p>
          <p><strong>Owner:</strong> {booking.owner?.name || "N/A"}</p>
          <p><strong>Status:</strong> {booking.status}</p>
        </div>
      ))}
    </div>
  );
};

export default YourBookings;

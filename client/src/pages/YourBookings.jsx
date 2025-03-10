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
        console.log("📌 Fetching bookings for user:", userId);
  
        const response = await axios.get(`http://localhost:5001/api/bookings/user/${userId}`);
        setBookings(response.data);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookings();
    
    // 🔄 Auto-refresh every 5 seconds to reflect updates
    const interval = setInterval(fetchBookings, 5000);
  
    return () => clearInterval(interval);
  }, []);
  

  if (loading) return <p className="text-center text-gray-400">Loading...</p>;
  if (bookings.length === 0) return <p className="text-center text-gray-400">No bookings found.</p>;

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">Your Bookings</h2>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {bookings.map((booking) => (
          <div key={booking._id} className="p-6 bg-gray-800 rounded-lg shadow-lg border border-purple-500">
            <h3 className="text-2xl font-semibold text-purple-300 mb-2">{booking.property?.title || "N/A"}</h3>
            
            <p className="text-gray-300 mb-1">
              <strong className="text-purple-400">📍 Location:</strong> {booking.property?.location || "N/A"}
            </p>
            
            <p className="text-gray-300 mb-1">
              <strong className="text-purple-400">👤 Owner:</strong> {booking.owner?.name || "N/A"}
            </p>
            
            <p className={`text-lg font-semibold ${booking.status === "Pending" ? "text-yellow-400" : "text-green-400"}`}>
              <strong>📌 Status:</strong> {booking.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourBookings;

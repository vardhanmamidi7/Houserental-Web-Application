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
          console.error("User not found in localStorage.");
          setLoading(false);
          return;
        }

        const userId = storedUser._id;
        const response = await axios.get(`http://localhost:5001/api/bookings/user/${userId}`);
        setBookings(response.data);
      } catch (err) {
        console.error("Error fetching bookings:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="text-center text-gray-300 mt-10 animate-pulse">Loading your bookings...</p>;
  if (bookings.length === 0) return <p className="text-center text-gray-400 mt-10">No bookings found.</p>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="relative mb-10">
        <h2 className="text-5xl font-extrabold text-center text-purple-400 drop-shadow-md tracking-wide z-10 relative">
          Your Bookings
        </h2>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 blur-2xl rounded-xl opacity-60 z-0"></div>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="p-6 bg-gray-800 hover:scale-[1.02] transition-transform duration-300 ease-in-out rounded-2xl shadow-2xl border border-purple-500/30"
          >
            <h3 className="text-2xl font-bold text-purple-300 mb-3">
              {booking.property?.title || "N/A"}
            </h3>

            <p className="text-gray-300 mb-2">
              <span className="font-semibold text-purple-400">Location:</span>{" "}
              {booking.property?.location || "N/A"}
            </p>

            <p className="text-gray-300 mb-2">
              <span className="font-semibold text-purple-400">Owner:</span>{" "}
              {booking.owner?.name || "N/A"}
            </p>

            <div className="mt-4">
              <span className="font-semibold text-purple-400">Status:</span>{" "}
              <span
                className={`inline-block px-3 py-1 mt-1 rounded-full text-sm font-semibold ${
                  booking.status === "Pending"
                    ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400"
                    : booking.status === "Accepted"
                    ? "bg-green-500/20 text-green-300 border border-green-400"
                    : "bg-red-500/20 text-red-300 border border-red-400"
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourBookings;

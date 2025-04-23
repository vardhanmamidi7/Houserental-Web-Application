import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const ViewHouse = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?._id) setUserId(storedUser._id);
  }, []);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/properties/${id}`);
        setHouse(res.data);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Unable to load house details. Please try again.");
      }
    };
    fetchHouseDetails();
  }, [id]);

  const handleContactOwner = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser?._id || !house?.owner?._id) {
        alert("User or house data missing.");
        return;
      }

      const bookingData = {
        userId: storedUser._id,
        propertyId: house._id,
        ownerId: house.owner._id,
      };

      const response = await axios.post("http://localhost:5001/api/bookings", bookingData);
      alert("Booking request sent successfully!");
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message === "Booking request already sent.") {
        alert("Booking already sent.");
      } else {
        alert(`Failed: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!house) return <p className="text-gray-400 text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen py-8 px-4 flex justify-center">
      <div className="max-w-5xl w-full bg-gray-900/70 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-6 animate-fade-in">{house.title}</h2>

        {/* Image Grid */}
        {house.images?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {house.images.map((img, i) => (
              <img
                key={i}
                src={`http://localhost:5001${img}`}
                alt={`House ${i + 1}`}
                className="w-full h-48 object-cover rounded-lg border border-gray-700 hover:scale-105 transition duration-300"
                onError={(e) => {
                  if (e.target.src !== "/default-house.jpg") {
                    e.target.src = "/default-house.jpg";
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 mb-4">No images available.</p>
        )}

        {/* Details Section */}
        <div className="space-y-3 text-lg text-gray-300">
          <p><strong className="text-purple-300">📍 Location:</strong> {house.location}</p>
          <p><strong className="text-purple-300">🏠 Type:</strong> {house.type}</p>
          <p><strong className="text-purple-300">💰 Rent:</strong> ${house.rent}/month</p>
          <p><strong className="text-purple-300">👥 Capacity:</strong> {house.capacity} people</p>
          <p><strong className="text-purple-300">📝 Description:</strong> {house.description}</p>
          <p><strong className="text-purple-300">👤 Owner:</strong> {house.owner?.name || "Not available"}</p>
          <p className="text-sm text-gray-500">
            <strong>🕒 Posted:</strong> {moment(house.createdAt).fromNow()} ({moment(house.createdAt).format("MMMM DD, YYYY")})
          </p>
        </div>

        {/* Contact Button */}
        <div className="text-center mt-8">
          <button
            onClick={handleContactOwner}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-300"
          >
            📩 Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewHouse;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const ViewHouse = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get stored user details from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id) {
      setUserId(storedUser._id);
    }
  }, []);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/properties/${id}`);
        console.log("✅ Fetched House Data:", response.data); // Debugging log
        setHouse(response.data);
      } catch (err) {
        console.error("❌ Error fetching house details:", err);
        setError("Failed to load house details. Please try again.");
      }
    };

    fetchHouseDetails();
  }, [id]);

  const handleContactOwner = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      console.log("📌 Stored User Data:", storedUser);
  
      if (!storedUser || !storedUser._id) {
        alert("User not found. Please log in again.");
        return;
      }
  
      if (!house || !house._id || !house.owner?._id) {
        alert("Invalid house details. Please try again.");
        console.error("❌ Missing House or Owner Data:", house);
        return;
      }
  
      const bookingData = {
        userId: storedUser._id,
        propertyId: house._id,
        ownerId: house.owner._id,
      };
  
      console.log("📌 Sending Booking Data:", bookingData);
  
      const response = await axios.post("http://localhost:5001/api/bookings", bookingData);
      
      console.log("✅ Booking & Order Created:", response.data);
      alert("Booking request sent successfully!");
  
    } catch (err) {
      console.error("❌ Error creating booking:", err.response?.data || err.message);
  
      // ✅ If the response message is "Booking request already sent", show an alert and stop further requests
      if (err.response?.status === 400 && err.response?.data?.message === "Booking request already sent.") {
        alert("Booking request already sent. You cannot send another request for this house.");
      } else {
        alert(`Failed to send request: ${err.response?.data?.message || err.message}`);
      }
    }
  };
  
  
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!house) return <p className="text-gray-400 text-center">Loading...</p>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 flex justify-center">
      <div className="max-w-4xl w-full bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-4">{house.title}</h2>

        {/* ✅ Check if images exist before mapping */}
        {house.images && house.images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {house.images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5001${image}`}
                alt={`House ${index + 1}`}
                className="w-full h-auto rounded-lg cursor-pointer"
                onClick={() => setLightboxIndex(index)}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center">No images available</p>
        )}

        <div className="mt-6 space-y-4">
          <p className="text-lg"><strong>📍 Location:</strong> {house.location}</p>
          <p className="text-lg"><strong>🏠 Type:</strong> {house.type}</p>
          <p className="text-lg"><strong>💰 Rent:</strong> ${house.rent}/month</p>
          <p className="text-lg"><strong>👥 Capacity:</strong> {house.capacity} people</p>
          <p className="text-lg"><strong>📝 Description:</strong> {house.description}</p>
          <p className="text-lg"><strong>👤 Owner:</strong> {house.owner?.name || "Not available"}</p>

          <p className="text-sm text-gray-400">
            <strong>🕒 Posted:</strong> {moment(house.createdAt).fromNow()} ({moment(house.createdAt).format("MMMM DD, YYYY")})
          </p>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={handleContactOwner}
            className="bg-purple-500 px-6 py-3 rounded-lg hover:bg-purple-600 transition"
          >
            Contact Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewHouse;

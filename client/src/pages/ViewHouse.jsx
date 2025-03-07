import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewHouse = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/properties/${id}`);
        setHouse(response.data);
      } catch (err) {
        console.error("Error fetching house details:", err);
        setError("Failed to load house details. Please try again.");
      }
    };

    fetchHouseDetails();
  }, [id]);

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!house) return <p className="text-gray-400 text-center">Loading...</p>;

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-3xl font-bold text-center text-purple-400">{house.title}</h2>

      {/* House Images */}
      <div className="flex overflow-x-auto space-x-4 p-4">
        {house.images.map((image, index) => (
          <img key={index} src={`http://localhost:5001${image}`} alt="House" className="h-60 rounded-lg shadow-lg" />
        ))}
      </div>

      {/* House Details */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-6">
        <p className="text-lg"><strong>Location:</strong> {house.location}</p>
        <p className="text-lg"><strong>Type:</strong> {house.type}</p>
        <p className="text-lg"><strong>Rent:</strong> ${house.rent}/month</p>
        <p className="text-lg"><strong>Capacity:</strong> {house.capacity} people</p>
        <p className="text-lg"><strong>Description:</strong> {house.description}</p>
      </div>

      {/* Contact Owner Button */}
      <div className="text-center mt-6">
        <button className="bg-purple-500 px-6 py-3 rounded-lg hover:bg-purple-600">
          Contact Owner
        </button>
      </div>
    </div>
  );
};

export default ViewHouse;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HouseRentalPage = () => {
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/properties");
        console.log("Fetched Houses:", response.data);
        setHouses(response.data);
        setFilteredHouses(response.data); // Initially, show all houses
      } catch (err) {
        console.error("Error fetching houses:", err);
        setError("Failed to load house listings. Please try again later.");
      }
    };

    fetchHouses();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = houses.filter((house) =>
      house.location.toLowerCase().includes(value)
    );
    setFilteredHouses(filtered);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-gray-800">
        <div className="text-2xl font-bold text-purple-400">Logo</div>
        <div className="flex gap-6">
          <button 
            className="hover:text-purple-400" 
            onClick={() => navigate("/your-bookings")}
          >
            Your Bookings
          </button>
          <button className="hover:text-purple-400">User Profile</button>
          <button 
            className="hover:text-purple-400" 
            onClick={() => navigate("/orders")}
          >
            Orders
          </button>
          <button
            className="bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600"
            onClick={() => navigate("/postrent")}
          >
            Post a House Rent
          </button>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="p-4 flex justify-center">
        <input
          type="text"
          placeholder="Search your location"
          value={searchTerm}
          onChange={handleSearch}
          className="w-1/2 p-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* House Listings */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredHouses.length > 0 ? (
          filteredHouses.map((house) => (
            <div key={house._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              {/* House Image */}
              <img
                src={house?.images?.length ? `http://localhost:5001${house.images[0]}` : "/default-house.jpg"}
                alt="House"
                className="w-full h-40 object-cover"
                onError={(e) => (e.target.src = "/default-house.jpg")} // Fallback image
              />

              {/* House Details */}
              <div className="p-4">
                <h3 className="text-lg font-bold">{house.title}</h3>
                <p className="text-sm text-gray-400">{house.location}</p>
                <p className="text-purple-400 font-semibold">${house.rent}/month</p>
                <p className="text-gray-300 text-sm mt-2">{house.description}</p>

                {/* View Button */}
                <button
                  className="mt-4 bg-purple-500 px-4 py-2 w-full rounded-lg hover:bg-purple-600"
                  onClick={() => navigate(`/viewhouse/${house._id}`)}
                >
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center w-full">No houses available.</p>
        )}
      </div>
    </div>
  );
};

export default HouseRentalPage;

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
        if (JSON.stringify(houses) !== JSON.stringify(response.data)) {
          setHouses(response.data);
          setFilteredHouses(response.data);
        }
      } catch (err) {
        console.error("Error fetching houses:", err);
        setError("Unable to load house listings. Please try again later.");
      }
    };

    fetchHouses();
  }, [houses]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = houses.filter((house) =>
      house.location.toLowerCase().includes(value)
    );

    if (JSON.stringify(filtered) !== JSON.stringify(filteredHouses)) {
      setFilteredHouses(filtered);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-5 bg-gray-800 shadow-lg">
        <div className="text-2xl font-extrabold text-purple-400 tracking-wide">HomeStay</div>
        <div className="flex gap-5 items-center text-sm font-medium">
          <button onClick={() => navigate("/your-bookings")} className="hover:text-purple-400 transition">Your Bookings</button>
          <button className="hover:text-purple-400 transition">Profile</button>
          <button onClick={() => navigate("/orders")} className="hover:text-purple-400 transition">Orders</button>
          <button
            className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-md transition text-white"
            onClick={() => navigate("/postrent")}
          >
            Post a House
          </button>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="p-6 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by location..."
          className="w-full max-w-md px-6 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}

      {/* Listings */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredHouses.length > 0 ? (
          filteredHouses.map((house) => (
            <div
              key={house._id}
              className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:scale-105 transition-all duration-300"
            >
              <img
                src={house?.images?.[0] ? `http://localhost:5001${house.images[0]}` : "/default-house.jpg"}
                alt="House"
                className="w-full h-48 object-cover transition duration-500 ease-in-out hover:opacity-80"
                onError={(e) => {
                  if (e.target.src !== "/default-house.jpg") {
                    e.target.src = "/default-house.jpg";
                  }
                }}
              />

              <div className="p-4 space-y-3">
                <h3 className="text-xl font-semibold text-purple-300 truncate">{house.title}</h3>
                <p className="text-gray-400 text-sm">{house.location}</p>
                <p className="text-green-400 font-bold text-lg">${house.rent} <span className="text-sm font-normal text-gray-300">/ month</span></p>
                <p className="text-gray-300 text-sm line-clamp-2">{house.description}</p>

                <button
                  className="mt-4 w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg text-sm font-semibold transition duration-300"
                  onClick={() => navigate(`/viewhouse/${house._id}`)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full">No houses available for this location.</p>
        )}
      </div>
    </div>
  );
};

export default HouseRentalPage;

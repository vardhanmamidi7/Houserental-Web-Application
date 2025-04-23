import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [ownerId, setOwnerId] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setOwnerId(user._id);
    }
  }, []);

  const fetchOrders = async () => {
    if (!ownerId) return;
    try {
      const response = await axios.get(`http://localhost:5001/api/orders/owner/${ownerId}`);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [ownerId]);

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5001/api/orders/update-status/${orderId}`, { status });
      fetchOrders();
      alert(`Booking ${status}`);
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen p-6">
      <div className="relative mb-10">
        <h2 className="text-5xl font-extrabold text-center text-purple-400 drop-shadow-md tracking-wide z-10 relative">
          All Orders
        </h2>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 blur-2xl rounded-xl opacity-60 z-0"></div>
      </div>

      {orders.length > 0 ? (
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <li
              key={order._id}
              className="bg-gray-800 hover:scale-[1.02] transition-transform duration-300 ease-in-out p-6 rounded-2xl shadow-2xl border border-purple-500/30"
            >
              <p className="text-lg mb-2">
                <span className="font-semibold text-purple-300">Property:</span>{" "}
                {order.property?.title || "N/A"}
              </p>
              <p className="text-lg mb-2">
                <span className="font-semibold text-purple-300">Renter:</span>{" "}
                {order.user?.name || "N/A"}
              </p>
              <p className="text-lg mb-2">
                <span className="font-semibold text-purple-300">Location:</span>{" "}
                {order.property?.location || "N/A"}
              </p>
              <p className="text-lg mb-4 flex items-center gap-2">
                <span className="font-semibold text-purple-300">Status:</span>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "Accepted"
                      ? "bg-green-500/20 text-green-300 border border-green-400"
                      : order.status === "Rejected"
                      ? "bg-red-500/20 text-red-300 border border-red-400"
                      : "bg-yellow-500/20 text-yellow-300 border border-yellow-400"
                  }`}
                >
                  {order.status || "Pending"}
                </span>
              </p>

              {order.status === "Pending" && (
                <div className="flex gap-4 mt-4">
                  <button
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-all"
                    onClick={() => handleStatusChange(order._id, "Accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-all"
                    onClick={() => handleStatusChange(order._id, "Rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400 mt-10 animate-pulse">No orders yet.</p>
      )}
    </div>
  );
};

export default OrdersPage;

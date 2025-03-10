import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [ownerId, setOwnerId] = useState(null);

  // ✅ Fetch logged-in user ID
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setOwnerId(user._id);
    }
  }, []);

  // ✅ Fetch Orders for the Logged-in Owner
  const fetchOrders = async () => {
    if (!ownerId) return;
    try {
      const response = await axios.get(`http://localhost:5001/api/orders/owner/${ownerId}`);
      setOrders(response.data);
    } catch (error) {
      console.error("❌ Error fetching orders:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [ownerId]);

  // ✅ Function to Accept/Reject Booking
  const handleStatusChange = async (orderId, status) => {
    try {
      console.log(`📌 Updating Order ID: ${orderId} ➡️ Status: ${status}`);

      await axios.put(`http://localhost:5001/api/orders/update-status/${orderId}`, { status });

      // ✅ Fetch Updated Orders
      fetchOrders();

      alert(`Booking ${status}`);
    } catch (error) {
      console.error(`❌ Error updating status:`, error.response?.data || error.message);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">Orders</h2>

      {orders.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="bg-gray-800 p-6 rounded-lg shadow-md border border-purple-500">
              <p className="text-lg"><strong>🏠 Property:</strong> {order.property?.title || "N/A"}</p>
              <p className="text-lg"><strong>👤 Renter:</strong> {order.user?.name || "N/A"}</p>
              <p className="text-lg"><strong>📍 Location:</strong> {order.property?.location || "N/A"}</p>
              <p className="text-lg"><strong>📌 Status:</strong> <span className={`font-semibold ${order.status === "Accepted" ? "text-green-400" : order.status === "Rejected" ? "text-red-400" : "text-yellow-400"}`}>{order.status || "Pending"}</span></p>

              {/* ✅ Show Buttons Only If Status Is Pending */}
              {order.status === "Pending" && (
                <div className="mt-4 flex gap-4">
                  <button 
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-semibold shadow-lg transition-all"
                    onClick={() => handleStatusChange(order._id, "Accepted")}
                  >
                    ✅ Accept
                  </button>
                  <button 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-semibold shadow-lg transition-all"
                    onClick={() => handleStatusChange(order._id, "Rejected")}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 mt-4">No orders yet.</p>
      )}
    </div>
  );
};

export default OrdersPage;

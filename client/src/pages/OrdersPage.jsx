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

  useEffect(() => {
    if (!ownerId) return;

    const fetchOrders = async () => {
      try {
        console.log(`📌 Fetching orders from: http://localhost:5001/api/orders/owner/${ownerId}`);
        
        const response = await axios.get(`http://localhost:5001/api/orders/owner/${ownerId}`);
        console.log("✅ Orders Fetched:", response.data);
        setOrders(response.data);
      } catch (error) {
        console.error("❌ Error fetching orders:", error.response?.data || error.message);
      }
    };

    fetchOrders();
  }, [ownerId]);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold text-purple-400">Orders</h2>

      {orders.length > 0 ? (
        <ul className="mt-4 space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p><strong>Property:</strong> {order.property?.title || "N/A"}</p>
              <p><strong>Renter:</strong> {order.user?.name || "N/A"}</p>
              <p><strong>Location:</strong> {order.property?.location || "N/A"}</p>
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

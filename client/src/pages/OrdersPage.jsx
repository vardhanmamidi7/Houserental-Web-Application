import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [ownerId, setOwnerId] = useState(null); // Store logged-in user ID

  useEffect(() => {
    // ✅ Fetch logged-in user ID (Assuming it's stored in localStorage)
    const user = JSON.parse(localStorage.getItem("user")); // Adjust key if different
    if (user && user._id) {
      setOwnerId(user._id);
    }
  }, []);

  useEffect(() => {
    if (!ownerId) return; // Don't fetch if no user ID

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/orders/${ownerId}`);
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
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
              <p><strong>Property:</strong> {order.property?.title}</p>
              <p><strong>Renter:</strong> {order.user?.name}</p>
              <p><strong>Location:</strong> {order.property?.location}</p>
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

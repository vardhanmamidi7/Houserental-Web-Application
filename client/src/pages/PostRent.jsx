import { useState } from "react";

const PostRent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    rent: "",
    roomType: "",
    capacity: "",
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: [...e.target.files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images") {
          value.forEach((file) => formDataToSend.append("images", file));
        } else {
          formDataToSend.append(key, value);
        }
      });

      const response = await fetch("http://localhost:5001/api/postrent", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Property posted successfully!");
        setFormData({ title: "", description: "", location: "", rent: "", roomType: "", capacity: "", images: [] });
      } else {
        setMessage(`❌ ${data.message || "Error posting property."}`);
      }
    } catch (error) {
      setMessage("❌ Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-purple-500 mb-6">Post Your Rental Property</h2>
        {message && <p className="text-center text-green-400 mb-4">{message}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" placeholder="Property Title" value={formData.title} onChange={handleChange} className="w-full p-3 border rounded bg-gray-700 text-white border-gray-600" required />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded bg-gray-700 text-white border-gray-600" required></textarea>
          <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-3 border rounded bg-gray-700 text-white border-gray-600" required />
          <input type="number" name="rent" placeholder="Rent (per month)" value={formData.rent} onChange={handleChange} className="w-full p-3 border rounded bg-gray-700 text-white border-gray-600" required />
          <select name="roomType" value={formData.roomType} onChange={handleChange} className="w-full p-3 border rounded bg-gray-700 text-white border-gray-600" required>
            <option value="">Select Room Type</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Shared">Shared</option>
          </select>
          <input type="number" name="capacity" placeholder="Accommodation Capacity" value={formData.capacity} onChange={handleChange} className="w-full p-3 border rounded bg-gray-700 text-white border-gray-600" required />
          
          <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
            <label className="text-gray-400">Upload Images:</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full mt-2" required />
          </div>
          
          <button type="submit" className={`w-full p-3 rounded text-white font-bold ${loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"}`} disabled={loading}>
            {loading ? "Posting..." : "Post Property"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostRent;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PostRent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    rent: "",
    type: "",
    capacity: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);

  const navigate = useNavigate();

  // ✅ Fetch user ID from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")); // ✅ Get full user object
    if (storedUser && storedUser._id) {
      setUserId(storedUser._id); // ✅ Store correct user ID
    } else {
      setMessage("❌ User not found. Please log in again.");
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    }
  }, []);

  // ✅ Handle image selection & preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));

    // Generate previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!userId) {
      setMessage("❌ User not found. Please log in again.");
      return;
    }

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach((file) => formDataToSend.append("images", file));
      } else {
        formDataToSend.append(key, value);
      }
    });

    formDataToSend.append("owner", userId); // ✅ Attach the correct user ID

    try {
      const response = await fetch("http://localhost:5001/api/postrent", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Property posted successfully!");

        // ✅ Redirect to House Rental page after 2 seconds
        setTimeout(() => {
          navigate("/houserental");
        }, 2000);

        setFormData({
          title: "",
          description: "",
          location: "",
          rent: "",
          type: "",
          capacity: "",
          images: [],
        });
        setImagePreviews([]);
      } else {
        setMessage(`❌ ${data.message || "Error posting property."}`);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      setMessage("❌ Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-purple-500 mb-6">
          Post Your Rental Property
        </h2>
        {message && <p className="text-center text-green-400 mb-4">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Property Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-3 border rounded bg-gray-700 text-white border-gray-600"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-3 border rounded bg-gray-700 text-white border-gray-600"
            required
          ></textarea>

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full p-3 border rounded bg-gray-700 text-white border-gray-600"
            required
          />

          <input
            type="number"
            name="rent"
            placeholder="Rent (per month)"
            value={formData.rent}
            onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
            className="w-full p-3 border rounded bg-gray-700 text-white border-gray-600"
            required
          />

          <select
            name="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full p-3 border rounded bg-gray-700 text-white border-gray-600"
            required
          >
            <option value="">Select Room Type</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Shared">Shared</option>
          </select>

          <input
            type="number"
            name="capacity"
            placeholder="Accommodation Capacity"
            value={formData.capacity}
            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
            className="w-full p-3 border rounded bg-gray-700 text-white border-gray-600"
            required
          />

          <div className="bg-gray-700 p-3 rounded-lg border border-gray-600">
            <label className="text-gray-400">Upload Images:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-2"
              required
            />
          </div>

          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {imagePreviews.map((src, index) => (
                <img key={index} src={src} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg" />
              ))}
            </div>
          )}

          <button
            type="submit"
            className={`w-full p-3 rounded text-white font-bold ${
              loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
            }`}
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Property"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostRent;

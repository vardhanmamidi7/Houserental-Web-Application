import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    state: "",
    password: "",
    role: "Rent-Taking Person",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ User registered successfully!");

        // 🟢 Store individual user details
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userId", data.user._id);

        setTimeout(() => {
          navigate("/houserental");
        }, 1000);
      } else {
        setMessage(`❌ ${data.message || "Error registering user."}`);
      }
    } catch (error) {
      setMessage("❌ Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-white">Sign Up</h2>
        {message && <p className="text-center text-green-400 mb-4">{message}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2 bg-gray-700 text-white border-gray-600"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2 bg-gray-700 text-white border-gray-600"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2 bg-gray-700 text-white border-gray-600"
          required
        />

        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.state}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2 bg-gray-700 text-white border-gray-600"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4 bg-gray-700 text-white border-gray-600"
          required
        />

        <label className="block text-sm text-gray-400 mb-2">Select Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4 bg-gray-700 text-white border-gray-600"
        >
          <option value="Owner">Owner</option>
          <option value="Rent-Taking Person">Rent-Taking Person</option>
        </select>

        <button
          type="submit"
          className={`w-full p-2 rounded text-white font-bold ${
            loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
          }`}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <div className="mt-4 text-center text-gray-400">
          <p>
            Already have an account?{" "}
            <Link to="/signin" className="text-purple-400 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;

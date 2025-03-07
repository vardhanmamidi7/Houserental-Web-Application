import { useState, useEffect } from "react"; // ✅ Add useState
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const Signin = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate function

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      // 🔹 First, check if the user exists
      const checkResponse = await fetch(
        `http://localhost:5001/api/auth/check-user?email=${formData.email}`
      );
      const checkData = await checkResponse.json();

      if (!checkResponse.ok || !checkData.exists) {
        setMessage("❌ User not found! Please sign up.");
        setLoading(false);
        return;
      }

      // 🔹 If user exists, proceed with login
      const response = await fetch("http://localhost:5001/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("✅ Sign in successful!");

        // 🔹 Redirect to House Rental Page after a short delay
        setTimeout(() => {
          navigate("/houserental"); // ✅ Correct route
        }, 1000);
      } else {
        setMessage(`❌ ${data.message || "Invalid credentials."}`);
      }
    } catch (error) {
      setMessage("❌ Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-md w-96 text-white"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>

        {message && <p className="text-center text-red-500">{message}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          autoComplete="off"
          className="w-full p-2 border rounded mb-2 bg-gray-700 text-white"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="off"
          className="w-full p-2 border rounded mb-2 bg-gray-700 text-white"
          required
        />

        <div className="flex justify-between text-sm mb-4">
          <Link to="/forgot-password" className="text-purple-400">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className={`w-full p-2 rounded text-white ${
            loading ? "bg-gray-600 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
          }`}
          disabled={loading}
        >
          {loading ? "Checking..." : "Sign In"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Not a member?{" "}
          <Link to="/signup" className="text-purple-400">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signin;

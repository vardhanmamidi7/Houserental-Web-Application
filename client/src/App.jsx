import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import Signin from "./components/Signin";
import HouseRentalPage from "./pages/HouseRentalPage";
import PostRent from "./pages/PostRent"; 
import ViewHouse from "./pages/ViewHouse";
import YourBookings from "./pages/YourBookings"; 
import OrdersPage from "./pages/OrdersPage"; // ✅ Import OrdersPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/houserental" element={<HouseRentalPage />} />
        <Route path="/viewhouse/:id" element={<ViewHouse />} />
        <Route path="/postrent" element={<PostRent />} />
        <Route path="/your-bookings" element={<YourBookings />} />
        <Route path="/orders" element={<OrdersPage />} /> {/* ✅ Added OrdersPage */}
      </Routes>
    </Router>
  );
}

export default App;

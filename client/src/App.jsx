import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import Signin from "./components/Signin";
import HouseRentalPage from "./pages/HouseRentalPage";
import PostRent from "./pages/PostRent"; 
import ViewHouse from "./pages/ViewHouse"; // ✅ Import ViewHouse

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/houserental" element={<HouseRentalPage />} /> {/* Change from /houses */}
        <Route path="/viewhouse/:id" element={<ViewHouse />} /> {/* ✅ Fixed route */}
        <Route path="/postrent" element={<PostRent />} /> 
      </Routes>
    </Router>
  );
}

export default App;

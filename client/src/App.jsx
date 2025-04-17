import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Navbar from "./components/Navbar";

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/" />;
};

function App() {
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 1000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Navbar
        user={user}
        setUser={setUser}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Routes>
        <Route
          path="/"
          element={<Home selectedCategory={selectedCategory} />}
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
        <Route
          path="/checkout"
          element={<PrivateRoute element={<Checkout />} />}
        />
      </Routes>
    </Router>
  );
}

export default App;

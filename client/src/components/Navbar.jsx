import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ user, setUser, selectedCategory, setSelectedCategory }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const categories = [
    "All",
    "Clothes",
    "Electronics",
    "Furniture",
    "Shoes",
    "Toys",
  ];

  useEffect(() => {
    const updateCartCount = async () => {
      const token = localStorage.getItem("token");
      if (token && user) {
        try {
          const { data } = await axios.get(`${apiUrl}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCartCount(data.summary?.totalQuantity || 0);
        } catch (error) {
          console.error("Error updating cart count:", error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();

    // Listen for storage changes
    window.addEventListener("storage", updateCartCount);

    // Custom event for cart updates
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setUser(null);
    navigate("/");
  };

  const handleCartClick = (e) => {
    if (!user) {
      e.preventDefault();
      navigate("/login");
    }
  };

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Categories */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-xl font-bold text-black no-underline overflow-hidden"
            >
              Shop
            </Link>

            {/* Desktop Categories */}
            <div className="hidden md:flex space-x-4 ml-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    navigate("/");
                  }}
                  className={`${
                    selectedCategory === category
                      ? "text-black border-b-2 border-black"
                      : "text-gray-500"
                  } hover:text-black transition-colors`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-600">{user.email}</span>
                <Link
                  to="/cart"
                  onClick={handleCartClick}
                  className="relative p-2 hover:bg-gray-100 rounded-full"
                >
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                  <FaShoppingCart className="h-6 w-6" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-black"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-black">
                  Login
                </Link>
                <Link to="/signup" className="text-gray-600 hover:text-black">
                  Signup
                </Link>
                <Link
                  to="/login"
                  onClick={handleCartClick}
                  className="relative p-2 hover:bg-gray-100 rounded-full"
                >
                  <FaShoppingCart className="h-6 w-6" />
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Categories Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed left-0 right-0 top-16 bg-white shadow-md py-4 z-50">
            <div className="container mx-auto px-4">
              <div className="flex flex-col space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsMobileMenuOpen(false);
                      navigate("/");
                    }}
                    className={`text-left px-4 py-2 ${
                      selectedCategory === category
                        ? "bg-gray-100 text-black"
                        : "text-gray-500"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear the cart after successful checkout
    localStorage.removeItem("cart");
    // Dispatch event to update cart count in navbar
    window.dispatchEvent(new Event("cartUpdated"));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 mb-8">
          Your order has been successfully placed. We'll send you an email with
          your order details shortly.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

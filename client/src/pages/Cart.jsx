import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CgSpinner } from "react-icons/cg";

const Cart = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${apiUrl}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartData(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${apiUrl}/api/cart/update/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartData(data);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error(error.response?.data?.error || "Failed to update quantity");
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.delete(
        `${apiUrl}/api/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartData(data);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <CgSpinner className="animate-spin h-12 w-12 text-blue-600" />
        </div>
      </div>
    );
  }

  if (!cartData?.items?.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <img
            src="/empty-cart.png"
            alt="Empty Cart"
            className="mx-auto w-48 mb-4"
          />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty!</h2>
          <p className="text-gray-600 mb-4">Add items to it now.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-sm hover:bg-blue-700"
          >
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-sm shadow">
              <div className="p-6">
                <h1 className="text-xl font-medium mb-4">
                  Shopping Cart ({cartData.summary.totalItems} items)
                </h1>
                <div className="space-y-4">
                  {cartData.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex gap-4 pb-4 border-b"
                    >
                      <div className="w-24 h-24">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold">
                            ${item.price}
                          </span>
                          {item.originalPrice &&
                            item.originalPrice > item.price && (
                              <>
                                <span className="text-gray-500 line-through text-sm">
                                  ${item.originalPrice}
                                </span>
                                <span className="text-green-600 text-sm">
                                  {Math.round(
                                    (1 - item.price / item.originalPrice) * 100
                                  )}
                                  % off
                                </span>
                              </>
                            )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border rounded-sm">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              className="px-3 py-1 hover:bg-gray-100"
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <span className="px-3 py-1 border-x">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId)}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-sm shadow p-6">
              <h2 className="text-gray-500 font-medium mb-4">PRICE DETAILS</h2>
              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between">
                  <span>Price ({cartData.summary.totalQuantity} items)</span>
                  <span>${cartData.summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-green-600">
                    -${cartData.summary.discount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  {cartData.summary.deliveryCharges > 0 ? (
                    <span>${cartData.summary.deliveryCharges.toFixed(2)}</span>
                  ) : (
                    <span className="text-green-600">FREE</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between font-medium pt-4">
                <span>Total Amount</span>
                <span>${cartData.summary.total.toFixed(2)}</span>
              </div>
              {cartData.summary.discount > 0 && (
                <p className="text-green-600 text-sm mt-4">
                  You will save ${cartData.summary.discount.toFixed(2)} on this
                  order
                </p>
              )}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-orange-500 text-white py-3 rounded-sm mt-6 hover:bg-orange-600"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

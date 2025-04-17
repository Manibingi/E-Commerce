const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  images: [{ type: String }],
  category: {
    name: { type: String },
    id: { type: String },
  },
  quantity: { type: Number, required: true, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    summary: {
      totalItems: { type: Number, default: 0 },
      totalQuantity: { type: Number, default: 0 },
      subtotal: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      deliveryCharges: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate summary
cartSchema.pre("save", function (next) {
  const cart = this;

  // Calculate totals
  let totalItems = cart.items.length;
  let totalQuantity = 0;
  let subtotal = 0;

  cart.items.forEach((item) => {
    totalQuantity += item.quantity;
    subtotal += item.price * item.quantity;
  });

  // Set delivery charges
  const deliveryCharges = subtotal > 500 ? 0 : 40;

  // Calculate discount
  const discount = subtotal > 1000 ? subtotal * 0.1 : 0;

  // Update summary
  cart.summary = {
    totalItems,
    totalQuantity,
    subtotal,
    discount,
    deliveryCharges,
    total: subtotal - discount + deliveryCharges,
  };

  next();
});

module.exports = mongoose.model("Cart", cartSchema);

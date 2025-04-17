const express = require("express");
const jwt = require("jsonwebtoken");
const Cart = require("../models/cart.model");
const router = express.Router();

// Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
}

// Get cart items
router.get("/", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.json({
        items: [],
        summary: {
          totalItems: 0,
          totalQuantity: 0,
          subtotal: 0,
          discount: 0,
          deliveryCharges: 0,
          total: 0,
        },
      });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error fetching cart" });
  }
});

// Add item to cart
router.post("/add", verifyToken, async (req, res) => {
  try {
    const {
      productId,
      title,
      price,
      originalPrice,
      images,
      category,
      quantity,
    } = req.body;

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    let cart = await Cart.findOne({ userId: req.userId });

    if (!cart) {
      cart = new Cart({
        userId: req.userId,
        items: [
          {
            productId,
            title,
            price,
            originalPrice,
            images,
            category,
            quantity,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({
          productId,
          title,
          price,
          originalPrice,
          images,
          category,
          quantity,
        });
      }
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error adding item to cart" });
  }
});

// Update item quantity
router.put("/update/:productId", verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const item = cart.items.find((item) => item.productId === productId);
    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error updating cart item" });
  }
});

// Remove item from cart
router.delete("/remove/:productId", verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: "Error removing item from cart" });
  }
});

// Clear cart
// router.delete("/clear", verifyToken, async (req, res) => {
//   try {
//     const cart = await Cart.findOneAndUpdate(
//       { userId: req.userId },
//       {
//         $set: {
//           items: [],
//           summary: {
//             totalItems: 0,
//             totalQuantity: 0,
//             subtotal: 0,
//             discount: 0,
//             deliveryCharges: 0,
//             total: 0,
//           },
//         },
//       },
//       { new: true }
//     );
//     res.json(cart || { message: "Cart cleared successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Error clearing cart" });
//   }
// });

module.exports = router;

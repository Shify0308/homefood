const express = require('express');
const router = express.Router();
const { Cart } = require('../models/ReviewCart');
const FoodItem = require('../models/FoodItem');
const { protect } = require('../middleware/auth');

// Get cart
router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = { items: [] };
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to cart
router.post('/add', protect, async (req, res) => {
  try {
    const { foodItemId, quantity = 1 } = req.body;
    
    const food = await FoodItem.findById(foodItemId).populate('seller', 'businessName');
    if (!food) return res.status(404).json({ message: 'Item not found' });
    if (!food.isAvailable) return res.status(400).json({ message: 'Item not available' });
    
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }
    
    const existingItem = cart.items.find(i => i.foodItem.toString() === foodItemId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        foodItem: food._id,
        name: food.name,
        price: food.price,
        image: food.image,
        quantity,
        seller: food.seller._id,
        sellerName: food.seller.businessName
      });
    }
    
    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ message: 'Added to cart', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update quantity
router.put('/update', protect, async (req, res) => {
  try {
    const { foodItemId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    const item = cart.items.find(i => i.foodItem.toString() === foodItemId);
    if (!item) return res.status(404).json({ message: 'Item not in cart' });
    
    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.foodItem.toString() !== foodItemId);
    } else {
      item.quantity = quantity;
    }
    
    await cart.save();
    res.json({ message: 'Cart updated', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from cart
router.delete('/remove/:foodItemId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    
    cart.items = cart.items.filter(i => i.foodItem.toString() !== req.params.foodItemId);
    await cart.save();
    res.json({ message: 'Item removed', cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear cart
router.delete('/clear', protect, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

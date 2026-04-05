const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const Seller = require('../models/Seller');
const { Cart } = require('../models/ReviewCart');
const { protect } = require('../middleware/auth');

// Create order
router.post('/create', protect, async (req, res) => {
  try {
    const { items, paymentMethod, deliveryAddress, phone } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    
    // Get seller from first item
    const firstItem = await FoodItem.findById(items[0].foodItem).populate('seller');
    if (!firstItem) return res.status(404).json({ message: 'Item not found' });
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 40;
    const tax = Math.round(subtotal * 0.05);
    const totalAmount = subtotal + deliveryFee + tax;
    
    const order = await Order.create({
      user: req.user._id,
      userName: req.user.name,
      userPhone: phone || req.user.phone,
      userAddress: deliveryAddress || req.user.address,
      items: items.map(i => ({
        foodItem: i.foodItem,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        seller: firstItem.seller._id,
        sellerName: firstItem.seller.businessName
      })),
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      seller: firstItem.seller._id
    });
    
    // Update food item order counts
    for (const item of items) {
      await FoodItem.findByIdAndUpdate(item.foodItem, { $inc: { totalOrders: item.quantity } });
    }
    
    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    
    res.status(201).json({ message: 'Order placed', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

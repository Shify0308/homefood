const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Seller = require('../models/Seller');
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');
const { protect, adminOnly } = require('../middleware/auth');

// Admin login (check in auth.js - using env vars)
// All routes need admin auth
router.use(protect, adminOnly);

// Dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalSellers = await Seller.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalFoodItems = await FoodItem.countDocuments();
    const pendingSellers = await Seller.countDocuments({ isApproved: false });
    
    const allOrders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    
    const recentOrders = await Order.find().sort('-createdAt').limit(10)
      .populate('user', 'name email');
    
    const topSellers = await Seller.find({ isActive: true })
      .sort('-totalOrders').limit(5).select('-password');
    
    res.json({ totalUsers, totalSellers, totalOrders, totalFoodItems, totalRevenue, pendingSellers, recentOrders, topSellers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort('-createdAt');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all sellers
router.get('/sellers', async (req, res) => {
  try {
    const sellers = await Seller.find().select('-password').sort('-createdAt');
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve seller
router.put('/sellers/:id/approve', async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.params.id, 
      { isApproved: true, isActive: true }, { new: true }).select('-password');
    res.json({ message: 'Seller approved', seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Activate/Deactivate seller
router.put('/sellers/:id/toggle', async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    seller.isActive = !seller.isActive;
    await seller.save();
    res.json({ message: `Seller ${seller.isActive ? 'activated' : 'deactivated'}`, seller });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete seller
router.delete('/sellers/:id', async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id);
    await FoodItem.deleteMany({ seller: req.params.id });
    res.json({ message: 'Seller deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Activate/Deactivate user
router.put('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort('-createdAt')
      .populate('user', 'name email')
      .populate('seller', 'businessName');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all food items
router.get('/food-items', async (req, res) => {
  try {
    const items = await FoodItem.find().populate('seller', 'businessName type').sort('-createdAt');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete food item
router.delete('/food-items/:id', async (req, res) => {
  try {
    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Food item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

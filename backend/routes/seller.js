const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');
const { Review } = require('../models/ReviewCart');
const { protect, sellerOnly } = require('../middleware/auth');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

// Add food item
router.post('/add-item', protect, sellerOnly, async (req, res) => {
  try {
    const { name, category, description, price, preparationTime, type, isAvailable } = req.body;
    
    if (!req.files?.image) return res.status(400).json({ message: 'Image is required' });
    
    const result = await uploadToCloudinary(req.files.image.tempFilePath, 'homefood/items');
    
    const foodItem = await FoodItem.create({
      name, category, description,
      price: Number(price),
      preparationTime: Number(preparationTime),
      type: type || 'food',
      isAvailable: isAvailable !== 'false',
      image: result.url,
      imageId: result.public_id,
      seller: req.user._id,
      sellerName: req.user.businessName,
      sellerCity: req.user.city
    });
    
    res.status(201).json({ message: 'Item added successfully', foodItem });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seller's items
router.get('/items', protect, sellerOnly, async (req, res) => {
  try {
    const items = await FoodItem.find({ seller: req.user._id }).sort('-createdAt');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update item
router.put('/update-item/:id', protect, sellerOnly, async (req, res) => {
  try {
    const item = await FoodItem.findOne({ _id: req.params.id, seller: req.user._id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    const { name, category, description, price, preparationTime, isAvailable } = req.body;
    
    if (req.files?.image) {
      if (item.imageId) await deleteFromCloudinary(item.imageId);
      const result = await uploadToCloudinary(req.files.image.tempFilePath, 'homefood/items');
      item.image = result.url;
      item.imageId = result.public_id;
    }
    
    if (name) item.name = name;
    if (category) item.category = category;
    if (description) item.description = description;
    if (price) item.price = Number(price);
    if (preparationTime) item.preparationTime = Number(preparationTime);
    if (isAvailable !== undefined) item.isAvailable = isAvailable !== 'false';
    
    await item.save();
    res.json({ message: 'Item updated', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete item
router.delete('/delete-item/:id', protect, sellerOnly, async (req, res) => {
  try {
    const item = await FoodItem.findOne({ _id: req.params.id, seller: req.user._id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    if (item.imageId) await deleteFromCloudinary(item.imageId);
    await item.deleteOne();
    
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seller orders
router.get('/orders', protect, sellerOnly, async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate('user', 'name email phone')
      .sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', protect, sellerOnly, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findOne({ _id: req.params.id, seller: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.orderStatus = orderStatus;
    order.updatedAt = Date.now();
    await order.save();
    
    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seller dashboard stats
router.get('/dashboard', protect, sellerOnly, async (req, res) => {
  try {
    const totalItems = await FoodItem.countDocuments({ seller: req.user._id });
    const totalOrders = await Order.countDocuments({ seller: req.user._id });
    const deliveredOrders = await Order.find({ seller: req.user._id, orderStatus: 'delivered' });
    const totalEarnings = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const recentOrders = await Order.find({ seller: req.user._id }).sort('-createdAt').limit(5);
    const reviews = await Review.find({ seller: req.user._id }).populate('user', 'name').sort('-createdAt').limit(5);
    
    res.json({ totalItems, totalOrders, totalEarnings, recentOrders, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

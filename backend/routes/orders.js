const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const { Cart } = require('../models/ReviewCart');
const { protect } = require('../middleware/auth');

router.post('/create', protect, async (req, res) => {
  try {
    const { items, paymentMethod, deliveryAddress, phone } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }
    const FoodItemDoc = await FoodItem.findById(items[0].foodItem).populate('seller');
    if (!FoodItemDoc) return res.status(404).json({ message: 'Item not found' });
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
        seller: FoodItemDoc.seller._id,
        sellerName: FoodItemDoc.seller.businessName
      })),
      subtotal,
      deliveryFee,
      tax,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      seller: FoodItemDoc.seller._id
    });
    for (const item of items) {
      await FoodItem.findByIdAndUpdate(item.foodItem, { $inc: { totalOrders: item.quantity } });
    }
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(201).json({ message: 'Order placed', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.orderStatus !== 'placed') {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }
    order.orderStatus = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled', order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
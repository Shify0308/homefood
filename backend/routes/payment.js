const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay order
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    
    const options = {
      amount: amount * 100, // in paise
      currency: 'INR',
      receipt: `receipt_${orderId || Date.now()}`,
      notes: { userId: req.user._id.toString() }
    };
    
    const razorpayOrder = await razorpay.orders.create(options);
    
    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    res.status(500).json({ message: 'Payment initiation failed: ' + error.message });
  }
});

// Verify payment
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;
    
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    
    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }
    
    // Update order payment status
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'paid',
        razorpayOrderId,
        razorpayPaymentId,
        orderStatus: 'confirmed'
      });
    }
    
    res.json({ message: 'Payment verified successfully', paymentId: razorpayPaymentId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

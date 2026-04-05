const express = require('express');
const router = express.Router();
const { Review } = require('../models/ReviewCart');
const FoodItem = require('../models/FoodItem');
const { protect } = require('../middleware/auth');

// Add review
router.post('/add', protect, async (req, res) => {
  try {
    const { foodItemId, sellerId, orderId, rating, comment } = req.body;
    
    const existing = await Review.findOne({ user: req.user._id, foodItem: foodItemId });
    if (existing) return res.status(400).json({ message: 'Already reviewed' });
    
    const review = await Review.create({
      user: req.user._id,
      userName: req.user.name,
      foodItem: foodItemId,
      seller: sellerId,
      order: orderId,
      rating,
      comment
    });
    
    // Update food item rating
    const reviews = await Review.find({ foodItem: foodItemId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await FoodItem.findByIdAndUpdate(foodItemId, {
      rating: Math.round(avgRating * 10) / 10,
      totalRatings: reviews.length
    });
    
    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for food item
router.get('/food/:foodItemId', async (req, res) => {
  try {
    const reviews = await Review.find({ foodItem: req.params.foodItemId })
      .populate('user', 'name').sort('-createdAt');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

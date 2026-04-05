const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const Seller = require('../models/Seller');

// Get all food items with filters
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, minRating, search, type, seller, city, sort } = req.query;
    
    let query = { isActive: true, isAvailable: true };
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (seller) query.seller = seller;
    if (city) query.sellerCity = { $regex: city, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minRating) query.rating = { $gte: Number(minRating) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { sellerName: { $regex: search, $options: 'i' } }
      ];
    }
    
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'popular') sortOption = { totalOrders: -1 };
    
    const items = await FoodItem.find(query)
      .populate('seller', 'businessName city type profileImage rating')
      .sort(sortOption)
      .limit(100);
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single food item
router.get('/:id', async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id)
      .populate('seller', 'businessName city type profileImage rating phone');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all chefs
router.get('/sellers/chefs', async (req, res) => {
  try {
    const chefs = await Seller.find({ type: 'Home Chef', isActive: true, isApproved: true })
      .select('-password');
    res.json(chefs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all bakers
router.get('/sellers/bakers', async (req, res) => {
  try {
    const bakers = await Seller.find({ type: 'Home Baker', isActive: true, isApproved: true })
      .select('-password');
    res.json(bakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get categories
router.get('/meta/categories', async (req, res) => {
  const categories = ['Biryani', 'Curry', 'Snacks', 'Desserts', 'Cakes', 'Breads', 'Sweets', 'Beverages', 'Breakfast', 'Lunch', 'Dinner', 'Bakery', 'Other'];
  res.json(categories);
});

module.exports = router;

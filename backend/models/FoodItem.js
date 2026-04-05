const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Biryani', 'Curry', 'Snacks', 'Desserts', 'Cakes', 'Breads', 'Sweets', 'Beverages', 'Breakfast', 'Lunch', 'Dinner', 'Bakery', 'Other']
  },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  imageId: { type: String, default: '' },
  preparationTime: { type: Number, required: true }, // in minutes
  isAvailable: { type: Boolean, default: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  sellerName: { type: String },
  sellerCity: { type: String },
  type: { type: String, enum: ['food', 'bakery'], default: 'food' },
  rating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FoodItem', foodItemSchema);

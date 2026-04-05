const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: String,
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const cartItemSchema = new mongoose.Schema({
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  name: String,
  price: Number,
  image: String,
  quantity: { type: Number, default: 1, min: 1 },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  sellerName: String
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);
const Cart = mongoose.model('Cart', cartSchema);

module.exports = { Review, Cart };

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sellerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  businessName: { type: String, required: true },
  type: { type: String, enum: ['Home Chef', 'Home Baker'], required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  fssai: { type: String, default: '' },
  password: { type: String, required: true },
  profileImage: { type: String, default: '' },
  profileImageId: { type: String, default: '' },
  isActive: { type: Boolean, default: false }, // Needs admin approval
  isApproved: { type: Boolean, default: false },
  role: { type: String, default: 'seller' },
  rating: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

sellerSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

sellerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Seller', sellerSchema);

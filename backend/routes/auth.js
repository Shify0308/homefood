const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Seller = require('../models/Seller');
const { generateToken } = require('../middleware/auth');
const { uploadToCloudinary } = require('../config/cloudinary');

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, phone, password, address });
    const token = generateToken(user._id, 'user');
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: 'user' }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/seller/register', async (req, res) => {
  try {
    const { name, businessName, type, email, phone, address, city, fssai, password } = req.body;
    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) return res.status(400).json({ message: 'Email already registered' });
    let profileImage = '';
    let profileImageId = '';
    if (req.files?.profileImage) {
      const result = await uploadToCloudinary(req.files.profileImage.tempFilePath, 'homefood/sellers');
      profileImage = result.url;
      profileImageId = result.public_id;
    }
    const seller = await Seller.create({
      name, businessName, type, email, phone, address, city, fssai, password,
      profileImage, profileImageId
    });
    res.status(201).json({
      message: 'Seller registration submitted. Awaiting admin approval.',
      seller: { id: seller._id, name: seller.name, email: seller.email, isApproved: false }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = generateToken('admin', 'admin');
      return res.json({ token, user: { id: 'admin', name: 'Admin', email, role: 'admin' } });
    }
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user._id, 'user');
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: 'user', phone: user.phone, address: user.address }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/seller/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(401).json({ message: 'Invalid credentials' });
    if (!seller.isApproved) return res.status(403).json({ message: 'Account pending admin approval' });
    if (!seller.isActive) return res.status(403).json({ message: 'Account deactivated' });
    const isMatch = await seller.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(seller._id, 'seller');
    res.json({
      token,
      user: {
        id: seller._id, name: seller.name, email: seller.email,
        role: 'seller', businessName: seller.businessName,
        type: seller.type, city: seller.city, profileImage: seller.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
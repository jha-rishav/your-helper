const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, phone, password });
    const token = signToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// Send OTP (demo — returns OTP in response for testing)
router.post('/send-otp', async (req, res) => {
  try {
    const { contact } = req.body; // email or phone
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store OTP in user record temporarily
    await User.findOneAndUpdate(
      { $or: [{ email: contact }, { phone: contact }] },
      { otp, otpExpiry: new Date(Date.now() + 10 * 60 * 1000) }
    );
    // In production send via SMS/email — for now return in response
    console.log(`OTP for ${contact}: ${otp}`);
    res.json({ message: 'OTP sent successfully', otp }); // remove otp from response in production
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Verify OTP and login
router.post('/verify-otp', async (req, res) => {
  try {
    const { contact, otp } = req.body;
    const user = await User.findOne({
      $or: [{ email: contact }, { phone: contact }],
      otp,
      otpExpiry: { $gt: new Date() }
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });
    await User.findByIdAndUpdate(user._id, { $unset: { otp: 1, otpExpiry: 1 } });
    const token = signToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

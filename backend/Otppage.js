const express = require('express');
const router = express.Router();
const User = require('./models/User');
const jwt = require('jsonwebtoken');

// POST /api/otp - Verify OTP
router.post('/', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Clear OTP and mark as verified
    user.otp = undefined;
    user.otpExpires = undefined;
    user.isVerified = true;
    await user.save();

    // Generate Token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });

    res.json({ success: true, token, message: 'Verification successful' });
  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

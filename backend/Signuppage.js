const express = require('express');
const router = express.Router();
const User = require('./models/User');

// POST /api/signup - Generate and send OTP for Registration
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // For Signup, check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      // In a real flow, you might want to tell them to login, 
      // but here we just update their OTP to allow login via signup route too
      user.otp = otp;
      user.otpExpires = otpExpires;
      await user.save();
    } else {
      user = new User({ email, otp, otpExpires });
      await user.save();
    }

    // MOCK EMAIL LOG
    console.log(`\n================================`);
    console.log(`[MOCK EMAIL SENT TO ${email}]`);
    console.log(`SUBJECT: Your Productr Signup OTP`);
    console.log(`OTP: ${otp}`);
    console.log(`================================\n`);

    res.json({ success: true, message: 'OTP sent successfully. Check backend console.' });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

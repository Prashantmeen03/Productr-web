const express = require('express');
const router = express.Router();
const User = require('./models/User');
const nodemailer = require('nodemailer');

// POST /api/login - Generate and send OTP
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Upsert user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ email });
    }
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // In a real application, you'd configure nodemailer with your SMTP details here:
    /*
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Login OTP',
      text: `Your OTP is ${otp}. It expires in 10 minutes.`
    });
    */
    
    // For now, we log it to the console so you can test without an SMTP server
    console.log(`\n================================`);
    console.log(`[MOCK EMAIL SENT TO ${email}]`);
    console.log(`SUBJECT: Your Productr Login OTP`);
    console.log(`OTP: ${otp}`);
    console.log(`================================\n`);

    res.json({ success: true, message: 'OTP sent successfully. Check backend console.' });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

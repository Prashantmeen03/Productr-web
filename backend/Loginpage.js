const express = require('express');
const router = express.Router();
const User = require('./models/User');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

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
    
    const isEmail = email.includes('@');

    if (isEmail) {
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
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
      }
      console.log(`\n================================`);
      console.log(`[EMAIL SENT TO ${email}]`);
      console.log(`SUBJECT: Your Productr Login OTP`);
      console.log(`OTP: ${otp}`);
      console.log(`================================\n`);
    } else {
      if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        await client.messages.create({
          body: `Your Productr Login OTP is ${otp}. It expires in 10 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: email.startsWith('+') ? email : `+${email}`
        });
      }
      console.log(`\n================================`);
      console.log(`[SMS SENT TO ${email}]`);
      console.log(`MESSAGE: Your Productr Login OTP is ${otp}`);
      console.log(`================================\n`);
    }

    res.json({ success: true, message: 'OTP sent successfully.', mockOtp: otp });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ 
      error: 'Server error', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;

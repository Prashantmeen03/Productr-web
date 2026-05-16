const express = require('express');
const router = express.Router();
const User = require('./models/User');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      profileImage: user.profileImage,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { name, email, mobile, profileImage } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (mobile !== undefined) user.mobile = mobile;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();
    res.json({ success: true, message: 'Profile updated' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

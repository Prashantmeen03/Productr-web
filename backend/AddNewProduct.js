const express = require('express');
const router = express.Router();
const Product = require('./models/Product');
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

// POST /api/add-product - Create a new product
router.post('/', authMiddleware, async (req, res) => {
  try {
    const productData = { ...req.body };
    productData.createdBy = req.userId;
    if (productData.isPublished === undefined || productData.isPublished === null) {
      productData.isPublished = false;
    } else {
      productData.isPublished = String(productData.isPublished) === "true";
    }
    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;

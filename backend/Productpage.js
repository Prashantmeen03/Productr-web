const express = require('express');
const router = express.Router();
const Product = require('./models/Product'); // Assuming models/Product exists

// GET /api/products - Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;

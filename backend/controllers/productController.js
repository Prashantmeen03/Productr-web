const Product = require('../models/Product');

// Create a Product
exports.createProduct = async (req, res) => {
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
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.userId });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a Product
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.isPublished !== undefined && updateData.isPublished !== null) {
      updateData.isPublished = String(updateData.isPublished) === "true";
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
    }
    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete a Product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
    }
    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

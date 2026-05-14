const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productType: { type: String, required: true },
  quantityStock: { type: Number, required: true },
  mrp: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  brandName: { type: String, required: true },
  description: { type: String },
  returnEligibility: { type: String, enum: ['Yes', 'No'], default: 'Yes' },
  isPublished: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

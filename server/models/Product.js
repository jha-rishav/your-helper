const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['stationery', 'uniform', 'books', 'electronics', 'accessories', 'other'], required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, default: '' },
  icon: { type: String, default: '📦' },
  inStock: { type: Boolean, default: true },
  tags: [{ type: String }],
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: {
    type: String,
    enum: ['college', 'office', 'event', 'travel', 'internship', 'accommodation', 'other'],
    required: true
  },
  description: { type: String, required: true },
  shortDesc: { type: String, required: true },
  icon: { type: String, default: '🛠️' },
  image: { type: String, default: '' },
  price: { type: Number, default: 0 },
  priceLabel: { type: String, default: 'Starting from' },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  tags: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);

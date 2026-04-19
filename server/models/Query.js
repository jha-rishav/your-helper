const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

const querySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['documents', 'internship', 'academics', 'hostel', 'fees', 'placement', 'general'],
    default: 'general'
  },
  tags: [{ type: String }],
  replies: [replySchema],
  isResolved: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Query', querySchema);

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  bookingId: { type: String, unique: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  details: { type: Object, default: {} },
  amount: { type: Number, default: 0 },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  paymentId: { type: String, default: '' },
  razorpayOrderId: { type: String, default: '' },
  notes: { type: String, default: '' },
  timeline: [{
    status: String,
    message: String,
    time: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'YH' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

const paymentService = require('./payment.service');

const createOrder = async (req, res) => {
  try {
    const order = await paymentService.createOrder(req.body.amount, req.body.bookingId);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const result = await paymentService.verifyPayment(req.body.bookingId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createOrder, verifyPayment };

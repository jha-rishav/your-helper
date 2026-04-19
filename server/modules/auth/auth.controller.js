const authService = require('./auth.service');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user._id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    const otp = await authService.sendOtp(req.body.contact);
    res.json({ message: 'OTP sent successfully', otp }); // remove otp in production
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const result = await authService.verifyOtp(req.body.contact, req.body.otp);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { register, login, getMe, sendOtp, verifyOtp };

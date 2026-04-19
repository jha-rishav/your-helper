const User = require('../../models/User');
const { signToken, formatUser } = require('../../config/helpers');

const register = async ({ name, email, phone, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new Error('Email already registered');
  const user = await User.create({ name, email, phone, password });
  return { token: signToken(user._id), user: formatUser(user) };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    throw new Error('Invalid credentials');
  return { token: signToken(user._id), user: formatUser(user) };
};

const getMe = async (userId) => {
  return await User.findById(userId).select('-password -otp -otpExpiry');
};

const sendOtp = async (contact) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const user = await User.findOneAndUpdate(
    { $or: [{ email: contact }, { phone: contact }] },
    { otp, otpExpiry: new Date(Date.now() + 10 * 60 * 1000) }
  );
  if (!user) throw new Error('No account found with this email or phone');
  console.log(`OTP for ${contact}: ${otp}`);
  return otp; // remove in production
};

const verifyOtp = async (contact, otp) => {
  const user = await User.findOne({
    $or: [{ email: contact }, { phone: contact }],
    otp,
    otpExpiry: { $gt: new Date() }
  });
  if (!user) throw new Error('Invalid or expired OTP');
  await User.findByIdAndUpdate(user._id, { $unset: { otp: 1, otpExpiry: 1 } });
  return { token: signToken(user._id), user: formatUser(user) };
};

module.exports = { register, login, getMe, sendOtp, verifyOtp };

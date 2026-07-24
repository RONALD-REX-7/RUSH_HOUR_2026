const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  const user = await User.create({ name, email, password, role, phone });
  const token = generateToken(user._id, user.role);
  res.status(201).json({ success: true, data: user, token, message: 'Registered successfully' });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id, user.role);
    res.status(200).json({ success: true, data: user, token, message: 'Logged in successfully' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: req.user, message: 'Profile retrieved' });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, location, businessDetails, avatar } = req.body;
  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (location) user.location = location;
  if (businessDetails) user.businessDetails = businessDetails;
  if (avatar) user.avatar = avatar;
  await user.save();
  res.status(200).json({ success: true, data: user, message: 'Profile updated' });
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (user && (await user.matchPassword(oldPassword))) {
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid old password' });
  }
});

module.exports = { register, login, getProfile, updateProfile, changePassword };

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(user) {
  return jwt.sign({ id: user._id.toString(), email: user.email }, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn: '1d',
  });
}

function serializeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    theme: user.theme,
    dailyGoal: user.dailyGoal,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register(req, res) {
  const { name, email, password, passwordConfirm } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return res.status(400).json({ message: 'Name, email, password, and confirmation are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  const existingUser = await User.findOne({ email: String(email).trim().toLowerCase() });
  if (existingUser) {
    return res.status(409).json({ message: 'An account with that email already exists.' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    passwordHash,
  });

  const token = createToken(user);
  res.cookie(process.env.COOKIE_NAME || 'campusflow_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: Number(process.env.COOKIE_MAX_AGE || 86400000),
  });

  return res.status(201).json({ message: 'Registration successful.', user: serializeUser(user) });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = await User.findOne({ email: String(email).trim().toLowerCase() });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = createToken(user);
  res.cookie(process.env.COOKIE_NAME || 'campusflow_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: Number(process.env.COOKIE_MAX_AGE || 86400000),
  });

  return res.json({ message: 'Login successful.', user: serializeUser(user) });
}

function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME || 'campusflow_token');
  return res.json({ message: 'Logout successful.' });
}

async function getMe(req, res) {
  return res.json({ user: serializeUser(req.user) });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'Current password, new password, and confirmation are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New passwords do not match.' });
  }

  const user = await User.findById(req.user._id);
  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: 'Current password is incorrect.' });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();

  return res.json({ message: 'Password updated successfully.' });
}

module.exports = { register, login, logout, getMe, changePassword };

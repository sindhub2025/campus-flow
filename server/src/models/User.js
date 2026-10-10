const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    passwordHash: { type: String, required: true },
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    dailyGoal: { type: Number, min: 0, max: 600, default: 60 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

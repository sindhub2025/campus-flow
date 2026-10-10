const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    code: { type: String, trim: true, maxlength: 20, default: '' },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    color: { type: String, default: '#6C63FF' },
    semester: { type: String, trim: true, maxlength: 40, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

subjectSchema.index({ owner: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);

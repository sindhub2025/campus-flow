const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, default: '', maxlength: 20000 },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
    tags: [{ type: String, trim: true, maxlength: 30 }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

noteSchema.index({ owner: 1, updatedAt: -1 });

module.exports = mongoose.model('Note', noteSchema);

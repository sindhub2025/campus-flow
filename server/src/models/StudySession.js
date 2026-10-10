const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema(
  {
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', default: null },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, default: null },
    plannedDurationMinutes: { type: Number, min: 15, max: 480, default: 60 },
    actualDurationMinutes: { type: Number, min: 0, max: 600, default: 0 },
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    reflection: { type: String, trim: true, maxlength: 1500, default: '' },
  },
  { timestamps: true }
);

studySessionSchema.index({ owner: 1, startTime: 1 });

module.exports = mongoose.model('StudySession', studySessionSchema);

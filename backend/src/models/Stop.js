const mongoose = require('mongoose');

const stopSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  cityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  cityName: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to get activities for this stop
stopSchema.virtual('activities', {
  ref: 'Activity',
  localField: '_id',
  foreignField: 'stopId'
});

// Calculate duration in days
stopSchema.virtual('durationDays').get(function() {
  if (!this.startDate || !this.endDate) return 0;
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
});

module.exports = mongoose.model('Stop', stopSchema);
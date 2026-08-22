const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  coverPhoto: {
    type: String,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  shareableLink: {
    type: String,
    unique: true,
    sparse: true
  },
  totalBudget: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'planned', 'ongoing', 'completed'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to get all stops for this trip
tripSchema.virtual('stops', {
  ref: 'Stop',
  localField: '_id',
  foreignField: 'tripId'
});

// Virtual to calculate total days
tripSchema.virtual('totalDays').get(function() {
  if (!this.startDate || !this.endDate) return 0;
  const diffTime = Math.abs(this.endDate - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
});

module.exports = mongoose.model('Trip', tripSchema);
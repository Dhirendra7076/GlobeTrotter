const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  stopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Stop',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['sightseeing', 'food', 'adventure', 'cultural', 'shopping', 'nature', 'nightlife', 'other'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String, // Format: "14:30"
    required: true
  },
  endTime: {
    type: String, // Format: "16:00"
    required: true
  },
  cost: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  duration: {
    type: Number, // in minutes
    default: 60
  },
  location: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  imageUrl: {
    type: String,
    default: null
  },
  bookingLink: {
    type: String,
    default: null
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Activity', activitySchema);
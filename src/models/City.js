const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true
  },
  region: {
    type: String // e.g., 'Europe', 'Asia', 'North America'
  },
  costIndex: {
    type: Number, // 1-10 (1=cheap, 10=expensive)
    default: 5
  },
  popularity: {
    type: Number, // 1-10
    default: 5
  },
  imageUrl: {
    type: String,
    default: null
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  description: {
    type: String,
    trim: true
  },
  attractions: [{
    type: String
  }],
  bestTimeToVisit: {
    type: String,
    trim: true
  }
});

module.exports = mongoose.model('City', citySchema);
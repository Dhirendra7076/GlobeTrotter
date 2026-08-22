const mongoose = require('mongoose');
require('dotenv').config();
const City = require('../src/models/City');

const cities = [
  {
    name: 'Paris',
    country: 'France',
    region: 'Europe',
    costIndex: 8,
    popularity: 10,
    timezone: 'Europe/Paris',
    currency: 'EUR',
    description: 'City of Love, known for the Eiffel Tower and art museums',
    attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral'],
    bestTimeToVisit: 'April to June, September to November'
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    region: 'Asia',
    costIndex: 4,
    popularity: 9,
    timezone: 'Asia/Bangkok',
    currency: 'THB',
    description: 'Vibrant city known for street food and temples',
    attractions: ['Grand Palace', 'Wat Arun', 'Chatuchak Market'],
    bestTimeToVisit: 'November to February'
  },
  // Add more cities...
];

async function seedCities() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await City.deleteMany({});
    await City.insertMany(cities);
    console.log('✅ Cities seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedCities();
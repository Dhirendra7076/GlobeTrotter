const mongoose = require('mongoose');
require('dotenv').config();
const City = require('../src/models/City');
const citiesData = require('./citiesData.json');

async function seedCities() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Clear existing cities
    await City.deleteMany({});
    console.log('🗑️  Removed existing cities');
    
    // Insert new cities
    const result = await City.insertMany(citiesData);
    console.log(`✅ Seeded ${result.length} cities successfully!`);
    
    // Show first few cities
    console.log('\n📊 Sample cities:');
    result.slice(0, 5).forEach(city => {
      console.log(`   - ${city.name}, ${city.country} (Cost: ${city.costIndex}/10, Popularity: ${city.popularity}/10)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedCities();
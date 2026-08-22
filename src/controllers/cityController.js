const City = require('../models/City');
const { AppError } = require('../middleware/errorHandler');

// Search cities with filters
exports.searchCities = async (req, res, next) => {
  try {
    const { q, country, region, minCost, maxCost, limit = 20 } = req.query;
    
    let query = {};
    
    // Text search on name and country
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { country: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Filter by country
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }
    
    // Filter by region
    if (region) {
      query.region = region;
    }
    
    // Filter by cost index
    if (minCost || maxCost) {
      query.costIndex = {};
      if (minCost) query.costIndex.$gte = parseInt(minCost);
      if (maxCost) query.costIndex.$lte = parseInt(maxCost);
    }
    
    const cities = await City.find(query)
      .limit(parseInt(limit))
      .sort({ popularity: -1 });
    
    res.json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (error) {
    next(error);
  }
};

// Get popular cities
exports.getPopularCities = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const cities = await City.find()
      .sort({ popularity: -1, name: 1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (error) {
    next(error);
  }
};

// Get city by ID
exports.getCityById = async (req, res, next) => {
  try {
    const { cityId } = req.params;
    
    const city = await City.findById(cityId);
    if (!city) {
      return next(new AppError('City not found', 404));
    }
    
    res.json({
      success: true,
      data: city
    });
  } catch (error) {
    next(error);
  }
};

// Get cities by region
exports.getCitiesByRegion = async (req, res, next) => {
  try {
    const { region } = req.params;
    
    const cities = await City.find({ region })
      .sort({ popularity: -1 });
    
    res.json({
      success: true,
      count: cities.length,
      data: cities
    });
  } catch (error) {
    next(error);
  }
};

// Seed cities (admin only - for development)
exports.seedCities = async (req, res, next) => {
  try {
    // This would be a protected route in production
    const citiesData = require('../../scripts/citiesData.json');
    
    await City.deleteMany({});
    const cities = await City.insertMany(citiesData);
    
    res.json({
      success: true,
      message: `${cities.length} cities seeded successfully`,
      data: cities
    });
  } catch (error) {
    next(error);
  }
};
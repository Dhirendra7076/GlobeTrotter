const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/search', cityController.searchCities);
router.get('/popular', cityController.getPopularCities);
router.get('/region/:region', cityController.getCitiesByRegion);
router.get('/:cityId', cityController.getCityById);

// Protected routes (for admin/development)
router.post('/seed', protect, cityController.seedCities);

module.exports = router;
const express = require('express');
const router = express.Router();
const stopController = require('../controllers/stopController');
const { protect } = require('../middleware/auth');
const { validateStop, validate } = require('../middleware/validation');

// All routes are protected
router.post('/trips/:tripId/stops', protect, validateStop, validate, stopController.addStop);
router.put('/stops/:stopId', protect, stopController.updateStop);
router.delete('/stops/:stopId', protect, stopController.deleteStop);
router.put('/stops/:stopId/reorder', protect, stopController.reorderStops);
router.get('/trips/:tripId/stops', protect, stopController.getStopsByTrip);

module.exports = router;  
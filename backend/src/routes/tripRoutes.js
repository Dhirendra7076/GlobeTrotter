const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const { protect } = require('../middleware/auth');
const { validateTrip, validate } = require('../middleware/validation');

router.route('/')
  .get(protect, tripController.getAllTrips)
  .post(protect, validateTrip, validate, tripController.createTrip);

router.get('/:tripId/public', tripController.getPublicTrip);
router.get('/:tripId', protect, tripController.getTripById);
router.put('/:tripId', protect, tripController.updateTrip);
router.delete('/:tripId', protect, tripController.deleteTrip);
router.post('/:tripId/share', protect, tripController.generateShareableLink);
router.post('/:tripId/copy', protect, tripController.copyTrip);

module.exports = router;  
const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { protect } = require('../middleware/auth');
const { validateActivity, validate } = require('../middleware/validation');

// All routes are protected
router.post('/stops/:stopId/activities', protect, validateActivity, validate, activityController.addActivity);
router.put('/activities/:activityId', protect, activityController.updateActivity);
router.delete('/activities/:activityId', protect, activityController.deleteActivity);
router.get('/stops/:stopId/activities', protect, activityController.getActivitiesByStop);

module.exports = router;  
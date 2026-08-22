const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const { protect } = require('../middleware/auth');

// Check if budgetController exists
let budgetControllerExists = true;
try {
  require('../controllers/budgetController');
} catch (error) {
  budgetControllerExists = false;
  console.log('⚠️  budgetController not found, budget routes will be disabled');
}

if (budgetControllerExists) {
  router.get('/trips/:tripId/budget', protect, budgetController.getBudgetBreakdown);
}

module.exports = router;
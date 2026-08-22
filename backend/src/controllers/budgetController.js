const Trip = require('../models/Trip');
const Stop = require('../models/Stop');
const Activity = require('../models/Activity');
const { AppError } = require('../middleware/errorHandler');

exports.getBudgetBreakdown = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    
    const trip = await Trip.findOne({ _id: tripId, userId: req.userId });
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }
    
    const stops = await Stop.find({ tripId }).populate('activities');
    
    let totalCost = 0;
    let dailyCosts = {};
    let costBreakdown = {
      activities: 0,
      // Add more categories if you have data
    };
    
    for (const stop of stops) {
      for (const activity of stop.activities) {
        totalCost += activity.cost || 0;
        costBreakdown.activities += activity.cost || 0;
        
        // Group by date for daily cost
        const dateKey = activity.date.toISOString().split('T')[0];
        if (!dailyCosts[dateKey]) dailyCosts[dateKey] = 0;
        dailyCosts[dateKey] += activity.cost || 0;
      }
    }
    
    // Convert daily costs to array
    const dailyBreakdown = Object.entries(dailyCosts)
      .map(([date, cost]) => ({ date, cost }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    res.json({
      success: true,
      data: {
        totalCost,
        costBreakdown,
        dailyBreakdown,
        averageDailyCost: dailyBreakdown.length > 0 ? totalCost / dailyBreakdown.length : 0,
        totalDays: trip.totalDays
      }
    });
  } catch (error) {
    next(error);
  }
};
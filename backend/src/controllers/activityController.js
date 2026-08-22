const Activity = require('../models/Activity');
const Stop = require('../models/Stop');
const { AppError } = require('../middleware/errorHandler');

exports.addActivity = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const { name, type, description, date, startTime, endTime, cost, duration, location, notes } = req.body;
    
    const activity = await Activity.create({
      stopId,
      name,
      type,
      description,
      date,
      startTime,
      endTime,
      cost: cost || 0,
      duration: duration || 60,
      location,
      notes
    });
    
    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error) {
    next(error);
  }
};

exports.updateActivity = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const updates = req.body;
    
    const activity = await Activity.findByIdAndUpdate(
      activityId,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!activity) {
      return next(new AppError('Activity not found', 404));
    }
    
    res.json({ success: true, data: activity });
  } catch (error) {
    next(error);
  }
};

exports.deleteActivity = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    
    const activity = await Activity.findByIdAndDelete(activityId);
    if (!activity) {
      return next(new AppError('Activity not found', 404));
    }
    
    res.json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add this missing function
exports.getActivitiesByStop = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    
    const activities = await Activity.find({ stopId })
      .sort({ date: 1, startTime: 1 });
    
    res.json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    next(error);
  }
};
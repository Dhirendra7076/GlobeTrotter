const Stop = require('../models/Stop');
const Trip = require('../models/Trip');
const Activity = require('../models/Activity');
const { AppError } = require('../middleware/errorHandler');

exports.addStop = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const { cityId, cityName, startDate, endDate, notes } = req.body;
    
    const trip = await Trip.findOne({ _id: tripId, userId: req.userId });
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }
    
    const stopCount = await Stop.countDocuments({ tripId });
    
    const stop = await Stop.create({
      tripId,
      cityId,
      cityName,
      order: stopCount + 1,
      startDate,
      endDate,
      notes
    });
    
    res.status(201).json({
      success: true,
      data: stop
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStop = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const updates = req.body;
    
    const stop = await Stop.findOneAndUpdate(
      { _id: stopId },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!stop) {
      return next(new AppError('Stop not found', 404));
    }
    
    res.json({ success: true, data: stop });
  } catch (error) {
    next(error);
  }
};

exports.deleteStop = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    
    const stop = await Stop.findByIdAndDelete(stopId);
    if (!stop) {
      return next(new AppError('Stop not found', 404));
    }
    
    await Activity.deleteMany({ stopId });
    
    const stops = await Stop.find({ tripId: stop.tripId })
      .sort({ order: 1 });
    
    for (let i = 0; i < stops.length; i++) {
      stops[i].order = i + 1;
      await stops[i].save();
    }
    
    res.json({
      success: true,
      message: 'Stop deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.reorderStops = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const { newOrder } = req.body;
    
    const stop = await Stop.findById(stopId);
    if (!stop) {
      return next(new AppError('Stop not found', 404));
    }
    
    const oldOrder = stop.order;
    
    if (newOrder > oldOrder) {
      await Stop.updateMany(
        { tripId: stop.tripId, order: { $gt: oldOrder, $lte: newOrder } },
        { $inc: { order: -1 } }
      );
    } else if (newOrder < oldOrder) {
      await Stop.updateMany(
        { tripId: stop.tripId, order: { $gte: newOrder, $lt: oldOrder } },
        { $inc: { order: 1 } }
      );
    }
    
    stop.order = newOrder;
    await stop.save();
    
    res.json({
      success: true,
      message: 'Stops reordered successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add this missing function
exports.getStopsByTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    
    const stops = await Stop.find({ tripId })
      .sort({ order: 1 })
      .populate('activities');
    
    res.json({
      success: true,
      count: stops.length,
      data: stops
    });
  } catch (error) {
    next(error);
  }
};
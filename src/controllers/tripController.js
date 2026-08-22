const Trip = require('../models/Trip');
const Stop = require('../models/Stop');
const Activity = require('../models/Activity');
const { AppError } = require('../middleware/errorHandler');

exports.getAllTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'stops',
        populate: { path: 'activities' }
      });
    
    res.json({
      success: true,
      count: trips.length,
      data: trips
    });
  } catch (error) {
    next(error);
  }
};

exports.getTripById = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    
    const trip = await Trip.findOne({ 
      _id: tripId,
      $or: [
        { userId: req.userId },
        { isPublic: true }
      ]
    }).populate({
      path: 'stops',
      options: { sort: { order: 1 } },
      populate: {
        path: 'activities',
        options: { sort: { date: 1, startTime: 1 } }
      }
    });
    
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }
    
    res.json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

exports.createTrip = async (req, res, next) => {
  try {
    const { name, description, startDate, endDate, coverPhoto, isPublic } = req.body;
    
    const trip = await Trip.create({
      userId: req.userId,
      name,
      description,
      startDate,
      endDate,
      coverPhoto,
      isPublic: isPublic || false
    });
    
    res.status(201).json({
      success: true,
      data: trip
    });
  } catch (error) {
    next(error);
  }
};

exports.updateTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const updates = req.body;
    
    const trip = await Trip.findOneAndUpdate(
      { _id: tripId, userId: req.userId },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }
    
    res.json({ success: true, data: trip });
  } catch (error) {
    next(error);
  }
};

exports.deleteTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    
    const trip = await Trip.findOneAndDelete({ 
      _id: tripId, 
      userId: req.userId 
    });
    
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }
    
    // Delete all associated stops and activities
    await Stop.deleteMany({ tripId });
    // Activities will be deleted via middleware or cascade
    
    res.json({ 
      success: true, 
      message: 'Trip deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
};

exports.generateShareableLink = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    
    const trip = await Trip.findOne({ _id: tripId, userId: req.userId });
    if (!trip) {
      return next(new AppError('Trip not found', 404));
    }
    
    // Generate unique link
    const shareableId = require('crypto').randomBytes(16).toString('hex');
    const shareableLink = `${process.env.FRONTEND_URL}/share/${shareableId}`;
    
    trip.shareableLink = shareableId;
    trip.isPublic = true;
    await trip.save();
    
    res.json({
      success: true,
      shareableLink
    });
  } catch (error) {
    next(error);
  }
};

exports.copyTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;
    
    // Get original trip
    const originalTrip = await Trip.findById(tripId)
      .populate({
        path: 'stops',
        populate: { path: 'activities' }
      });
    
    if (!originalTrip) {
      return next(new AppError('Trip not found', 404));
    }
    
    // Create new trip
    const newTrip = await Trip.create({
      userId: req.userId,
      name: `${originalTrip.name} (Copy)`,
      description: originalTrip.description,
      startDate: originalTrip.startDate,
      endDate: originalTrip.endDate,
      isPublic: false
    });
    
    // Copy stops and activities
    for (const stop of originalTrip.stops) {
      const newStop = await Stop.create({
        tripId: newTrip._id,
        cityId: stop.cityId,
        cityName: stop.cityName,
        order: stop.order,
        startDate: stop.startDate,
        endDate: stop.endDate,
        notes: stop.notes
      });
      
      // Copy activities
      for (const activity of stop.activities) {
        await Activity.create({
          stopId: newStop._id,
          name: activity.name,
          type: activity.type,
          description: activity.description,
          date: activity.date,
          startTime: activity.startTime,
          endTime: activity.endTime,
          cost: activity.cost,
          duration: activity.duration,
          notes: activity.notes
        });
      }
    }
    
    res.status(201).json({
      success: true,
      data: newTrip
    });
  } catch (error) {
    next(error);
  }
};
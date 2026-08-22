const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return next(new AppError('Please log in to access this resource', 401));
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please log in again.', 401));
    }
    next(error);
  }
};

// Optional: Add role-based authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
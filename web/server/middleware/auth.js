const jwt = require('jsonwebtoken');
const { getModels } = require('../models');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get models and find user
    const { User } = await getModels();
    
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'username', 'email', 'role']
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ 
        success: false, 
        message: 'Token expired.' 
      });
    }
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error.', 
      error: error.message 
    });
  }
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin only.' 
    });
  }
  next();
};

module.exports = { authenticateToken, authorizeAdmin };
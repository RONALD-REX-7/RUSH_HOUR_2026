const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // Verify Supabase JWT using the Supabase JWT Secret
      const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
      
      // req.user will contain the decoded Supabase JWT payload
      // decoded.sub is the user ID
      req.user = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.user_metadata?.role || 'Citizen',
        name: decoded.user_metadata?.name || ''
      };
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
});

module.exports = { protect };

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is close to expiration (e.g., less than 5 minutes left)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp - currentTime < 300) {
      // Token is close to expiration, refresh it
      const refreshedToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      // Set the refreshed token in the response header
      res.setHeader('x-auth-token', refreshedToken);
    }
    
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

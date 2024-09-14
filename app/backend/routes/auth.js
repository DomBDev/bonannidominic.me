const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/Users');

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

router.post('/check-token', async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.json({ isValid: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is close to expiration (e.g., less than 5 minutes left)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp - currentTime < 300) {
      // Token is close to expiration, refresh it
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.json({ isValid: false });
      }

      const refreshedToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      return res.json({ isValid: true, refreshedToken });
    }

    // Token is valid and not close to expiration
    return res.json({ isValid: true });
  } catch (error) {
    // Token is invalid
    return res.json({ isValid: false });
  }
});

module.exports = router;
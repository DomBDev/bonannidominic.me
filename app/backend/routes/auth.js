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
    
    // Token is valid
    return res.json({ isValid: true });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Token is expired, client should use refresh token
      return res.json({ isValid: false, needsRefresh: true });
    }
    // Token is invalid
    return res.json({ isValid: false });
  }
});

module.exports = router;
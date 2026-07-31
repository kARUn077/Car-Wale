const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile
router.get('/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).populate('wishlist');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/:email', async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: req.params.email }, 
      req.body, 
      { new: true }
    );
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to wishlist
router.post('/:email/wishlist', async (req, res) => {
  try {
    const { carId } = req.body;
    const user = await User.findOne({ email: req.params.email });
    
    if (!user.wishlist.includes(carId)) {
      user.wishlist.push(carId);
      await user.save();
    }
    
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from wishlist
router.delete('/:email/wishlist/:carId', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    
    user.wishlist = user.wishlist.filter(id => id.toString() !== req.params.carId);
    await user.save();
    
    res.json(user.wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

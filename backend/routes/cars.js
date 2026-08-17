const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// Get all cars (for buyers)
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find({ status: 'active' });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get seller's cars
router.get('/seller/:email', async (req, res) => {
  try {
    const cars = await Car.find({ sellerEmail: req.params.email });
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new car
router.post('/', async (req, res) => {
  try {
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(201).json(newCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a car
router.put('/:id', async (req, res) => {
  try {
    const updatedCar = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a car
router.delete('/:id', async (req, res) => {
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'Car deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single car and increment views
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a review to a car
router.post('/:id/reviews', async (req, res) => {
  try {
    const { userName, rating, comment } = req.body;
    if (!userName || !rating || !comment) {
      return res.status(400).json({ error: 'userName, rating, and comment are required' });
    }
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    car.reviews.push({ userName, rating: Number(rating), comment });
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

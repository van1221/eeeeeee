const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const auth = require('../middleware/auth');

// Get all stations
router.get('/', async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reserve a station
router.post('/:id/reserve', auth, async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ error: 'Station not found' });
    }
    
    if (!station.available) {
      return res.status(400).json({ error: 'Station is not available' });
    }
    
    station.available = false;
    station.reservedBy = req.user.userId;
    await station.save();
    
    res.json({ message: 'Station reserved successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

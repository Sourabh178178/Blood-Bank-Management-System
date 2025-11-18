const express = require('express');
const router = express.Router();
const controller = require('../controllers/bloodBankController');
const { protect } = require('../middlewares/auth');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const Request = require('../models/Request');
// Inventory routes
router.get('/inventory', protect, controller.getInventory);
router.post('/inventory', protect, controller.updateInventory);

// Dashboard route
router.get('/dashboard', protect, controller.getDashboard);

// Requests routes
// Replace the existing /requests route with this
router.get('/requests', protect, async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    
    // Date filtering
    if (start || end) {
      filter.createdAt = {};
      if (start) filter.createdAt.$gte = new Date(start);
      if (end) filter.createdAt.$lte = new Date(end);
    }

    const requests = await Request.find(filter)
      .sort({ createdAt: -1 }) // Sort by newest first
      .populate('hospital', 'name address contact');

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/requests/:id', protect, controller.updateRequestStatus);

// Statistics route
router.get('/statistics', protect, controller.getStatistics);

// --- Add these admin directory endpoints ---
router.get('/donors', protect, async (req, res) => {
  try {
    const donors = await Donor.find()
      .populate('user', 'name email')
      .select('phone bloodType'); // Explicitly include phone
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/hospitals', protect, async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate('user', 'name email');
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

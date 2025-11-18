const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const Donation = require('../models/Donation');
const Transaction = require('../models/Transaction');
const Donor = require('../models/Donor'); // <-- Make sure to import Donor
const Hospital = require('../models/Hospital');
// POST /api/donations - Create new donation + transaction
router.post('/', protect, async (req, res) => {
  try {
    const { date, location, quantity } = req.body;

    if (!date || !location || !quantity) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Fetch the donor and their blood type
    const donor = await Donor.findOne({ user: req.user.id });
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // 1. Create Donation (optional)
    const donation = await Donation.create({
      donor: req.user.id,
      date,
      location,
      quantity,
      bloodType: donor.bloodType // Use donor's blood type
    });

    // 2. Create Transaction (required for statistics)
    await Transaction.create({
      donor: req.user.id,
      bloodType: donor.bloodType, // Use donor's blood type
      quantity,
      type: 'donation',
      date
    });

    res.status(201).json(donation);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
  // Get all donors
router.get('/donors', protect, async (req, res) => {
  try {
    const donors = await Donor.find().populate('user', 'name email');
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all hospitals
router.get('/hospitals', protect, async (req, res) => {
  try {
    const hospitals = await Hospital.find().populate('user', 'name email');
    res.json(hospitals);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

});


// GET /api/donations/history - Get donation history
router.get('/history', protect, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user.id }).sort('-date');
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

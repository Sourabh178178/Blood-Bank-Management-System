const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const Donor = require('../models/Donor');
const User = require('../models/User');

// GET /api/donor/profile - Get donor profile
router.get('/profile', protect, async (req, res) => {
  const donor = await Donor.findOne({ user: req.user._id });
  const user = await User.findById(req.user._id);
  if (!donor || !user) {
    return res.status(404).json({ message: 'Donor not found' });
  }
  res.json({
    name: user.name,
    email: user.email,
    bloodType: donor.bloodType,
    phone: donor.phone,
    address: donor.address,
    dob: donor.dob
  });
});

// PUT /api/donor/profile - Update donor profile
router.put('/profile', protect, async (req, res) => {
  const donor = await Donor.findOne({ user: req.user._id });
  const user = await User.findById(req.user._id);

  if (!donor || !user) {
    return res.status(404).json({ message: 'Donor not found' });
  }

  // Update User fields
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  await user.save();

  // Update Donor fields
  donor.phone = req.body.phone || donor.phone;
  donor.address = req.body.address || donor.address;
  donor.dob = req.body.dob || donor.dob;
  await donor.save();

  res.json({
    name: user.name,
    email: user.email,
    bloodType: donor.bloodType,
    phone: donor.phone,
    address: donor.address,
    dob: donor.dob
  });
});

module.exports = router;

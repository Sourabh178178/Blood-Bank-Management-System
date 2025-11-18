const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const Donor = require('../models/Donor');

exports.createDonation = asyncHandler(async (req, res) => {
  const { bloodType, quantity, notes } = req.body;
  const donor = await Donor.findOne({ user: req.user._id });
  if (!donor) {
    res.status(404);
    throw new Error('Donor not found');
  }
  const transaction = await Transaction.create({
    donor: donor._id,
    bloodType,
    quantity,
    type: 'donation',
    date: new Date(),
    notes
  });
  res.status(201).json(transaction);
});

const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const Request = require('../models/Request');
const Donor = require('../models/Donor');
const Hospital = require('../models/Hospital');
const BloodBank = require('../models/BloodBank');

// Get blood bank statistics
const getStatistics = asyncHandler(async (req, res) => {
  try {
    const [
      totalDonations,
      totalDistributions,
      totalDonors,
      totalHospitals,
      bloodTypeStats,
      recentRequests,
      bloodBank
    ] = await Promise.all([
      Transaction.countDocuments({ type: 'donation' }),
      Transaction.countDocuments({ type: 'distribution' }),
      Donor.countDocuments(),
      Hospital.countDocuments(),
      Transaction.aggregate([
        {
          $group: {
            _id: '$bloodType',
            total: { $sum: '$quantity' }
          }
        }
      ]),
      Request.find().sort({ createdAt: -1 }).limit(5).populate('hospital', 'name'),
      BloodBank.findOne()
    ]);
    res.json({
      totalDonations,
      totalDistributions,
      totalDonors,
      totalHospitals,
      bloodTypeStats,
      recentRequests,
      inventoryStatus: bloodBank ? bloodBank.inventory : []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get blood bank inventory status
const getInventoryStats = asyncHandler(async (req, res) => {
  try {
    const bloodBank = await BloodBank.findOne();
    if (!bloodBank) {
      return res.status(404).json({ message: 'Blood bank not found' });
    }
    res.json(bloodBank.inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = {
  getStatistics,
  getInventoryStats,
};

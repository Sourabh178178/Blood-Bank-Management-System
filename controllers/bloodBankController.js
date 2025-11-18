// controllers/bloodBankController.js

const asyncHandler = require('express-async-handler');
const BloodBank = require('../models/BloodBank');
const Transaction = require('../models/Transaction');
const Request = require('../models/Request'); // Make sure this model exists

// GET /bloodbank/dashboard
// controllers/bloodBankController.js

const getDashboard = asyncHandler(async (req, res) => {
  // Aggregate donations and distributions by blood type
  const bloodTypeDistribution = await Transaction.aggregate([
    {
      $group: {
        _id: { bloodType: "$bloodType", type: "$type" },
        total: { $sum: "$quantity" }
      }
    },
    {
      $group: {
        _id: "$_id.bloodType",
        donations: {
          $sum: { $cond: [{ $eq: ["$_id.type", "donation"] }, "$total", 0] }
        },
        distributions: {
          $sum: { $cond: [{ $eq: ["$_id.type", "distribution"] }, "$total", 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        bloodType: "$_id",
        donations: 1,
        distributions: 1
      }
    }
  ]);

  // Calculate total donations/distributions (sum of quantities, not document count)
  const totalDonations = bloodTypeDistribution.reduce((acc, curr) => acc + curr.donations, 0);
  const totalDistributions = bloodTypeDistribution.reduce((acc, curr) => acc + curr.distributions, 0);

  res.json({
    totalDonations,
    totalDistributions,
    bloodTypeDistribution
  });
});

// GET /bloodbank/statistics
const getStatistics = asyncHandler(async (req, res) => {
  try {
    const [
      totalDonations,
      totalDistributions,
      activeDonors,
      distributedHospitals,
      distributionStats,
      donationStats,
      recentRequests,
      bloodBank
    ] = await Promise.all([
      Transaction.countDocuments({ type: 'donation' }),
      Transaction.countDocuments({ type: 'distribution' }),
      Transaction.distinct('donor', { type: 'donation' }),
      Transaction.distinct('hospital', { type: 'distribution' }),
      // Distribution by blood type
      Transaction.aggregate([
        { $match: { type: 'distribution' } },
        { $group: { _id: '$bloodType', total: { $sum: '$quantity' } } }
      ]),
      // Donation by blood type
      Transaction.aggregate([
        { $match: { type: 'donation' } },
        { $group: { _id: '$bloodType', total: { $sum: '$quantity' } } }
      ]),
      Request.find({ status: 'fulfilled' })
        .populate('hospital', 'name')
        .sort({ createdAt: -1 })
        .limit(5),
      BloodBank.findOne()
    ]);

    res.json({
      totalDonations,
      totalDistributions,
      totalDonors: activeDonors.length,
      totalHospitals: distributedHospitals.length,
      distributionStats,
      donationStats,
      recentRequests,
      inventoryStatus: bloodBank ? bloodBank.inventory : []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


// GET /bloodbank/inventory
const getInventory = asyncHandler(async (req, res) => {
  const bloodBank = await BloodBank.findOne();
  if (!bloodBank) {
    res.status(404);
    throw new Error('Blood bank not found');
  }
  res.json(bloodBank.inventory);
});

// POST /bloodbank/inventory
const updateInventory = asyncHandler(async (req, res) => {
  const { bloodType, quantity, action } = req.body;
  const bloodBank = await BloodBank.findOne();
  if (!bloodBank) {
    res.status(404);
    throw new Error('Blood bank not found');
  }
  let item = bloodBank.inventory.find(i => i.bloodType === bloodType);
  const qty = parseInt(quantity, 10);
  if (!item) {
    bloodBank.inventory.push({ bloodType, quantity: action === 'add' ? qty : -qty });
  } else {
    item.quantity = action === 'add' ? item.quantity + qty : item.quantity - qty;
  }
  await bloodBank.save();
  res.json(bloodBank.inventory);
});

// GET /bloodbank/requests
const getRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find().populate('hospital').sort({ createdAt: -1 });
  res.json(requests);
});

// PUT /bloodbank/requests/:id
// PUT /bloodbank/requests/:id
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const request = await Request.findById(id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }

  // If admin wants to approve and fulfill in one step
  if (status === 'fulfilled' && request.status !== 'fulfilled') {
    // Set status to approved first (for audit trail)
    request.status = 'approved';
    await request.save();

    // Now fulfill: update inventory and create transaction
    const bloodBank = await BloodBank.findOne();
    if (!bloodBank) {
      res.status(404);
      throw new Error('Blood bank not found');
    }
    const item = bloodBank.inventory.find(i => i.bloodType === request.bloodType);
    if (!item) {
      res.status(400);
      throw new Error('Requested blood type not available in inventory');
    }
    if (item.quantity < request.quantity) {
      res.status(400);
      throw new Error('Not enough units available in inventory');
    }
    item.quantity -= request.quantity;
    await bloodBank.save();

    // Create a distribution transaction
    await Transaction.create({
      type: 'distribution',
      bloodType: request.bloodType,
      quantity: request.quantity,
      hospital: request.hospital,
      date: new Date()
    });

    // Finally, set status to fulfilled
    request.status = 'fulfilled';
    await request.save();

    return res.json(request);
  }

  // If status is only "approved" (not fulfilled), just update status
  request.status = status;
  await request.save();
  res.json(request);
});


module.exports = {
  getDashboard,
  getStatistics,
  getInventory,
  updateInventory,
  getRequests,
  updateRequestStatus,
};

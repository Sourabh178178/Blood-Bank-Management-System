const asyncHandler = require('express-async-handler');
const Request = require('../models/Request');
const BloodBank = require('../models/BloodBank');
const Transaction = require('../models/Transaction');

// Get all requests (for admin)
const getRequests = asyncHandler(async (req, res) => {
  const requests = await Request.find()
    .populate('hospital', 'name address contact')
    .sort({ createdAt: -1 });
  res.json(requests);
});

// Update request status (for admin)
const updateRequestStatus = asyncHandler(async (req, res) => {
  const { status, adminNotes } = req.body;
  const request = await Request.findById(req.params.id);
  if (!request) {
    res.status(404);
    throw new Error('Request not found');
  }
  request.status = status || request.status;
  request.adminNotes = adminNotes || request.adminNotes;
  request.responseDate = Date.now();

  // If request is fulfilled, create a transaction and update inventory
  if (status === 'fulfilled') {
    const bloodBank = await BloodBank.findOne();
    const bloodTypeItem = bloodBank.inventory.find(item => item.bloodType === request.bloodType);
    if (!bloodTypeItem || bloodTypeItem.quantity < request.quantity) {
      res.status(400);
      throw new Error('Not enough blood in inventory');
    }
    await Transaction.create({
      hospital: request.hospital,
      bloodType: request.bloodType,
      quantity: request.quantity,
      type: 'distribution',
      notes: `Request ${request._id} fulfilled`
    });
    bloodTypeItem.quantity -= request.quantity;
    bloodTypeItem.lastUpdated = Date.now();
    await bloodBank.save();
  }

  const updatedRequest = await request.save();
  res.json(updatedRequest);
});

module.exports = {
  getRequests,
  updateRequestStatus,
};

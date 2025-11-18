const asyncHandler = require('express-async-handler');
const Hospital = require('../models/Hospital');
const Request = require('../models/Request');
const Transaction = require('../models/Transaction');
const BloodBank = require('../models/BloodBank');

// GET /api/hospital/dashboard
exports.getHospitalDashboard = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findOne({ user: req.user._id });
  if (!hospital) {
    res.status(404);
    throw new Error('Hospital not found');
  }
  const requests = await Request.find({ hospital: hospital._id });
  const pendingRequests = requests.filter(r => r.status === 'pending').length;
  const approvedRequests = requests.filter(r => r.status === 'approved').length;
  const thisMonth = new Date().getMonth();
  const totalRequestsThisMonth = requests.filter(r => new Date(r.createdAt).getMonth() === thisMonth).length;
  const recentRequests = requests
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);
  const bloodBank = await BloodBank.findOne();
  const bloodInventory = bloodBank ? bloodBank.inventory : [];
  res.json({
    pendingRequests,
    approvedRequests,
    totalRequestsThisMonth,
    bloodInventory,
    recentRequests
  });
});

// GET /api/hospital/profile
exports.getHospitalProfile = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findOne({ user: req.user._id });
  if (!hospital) {
    res.status(404);
    throw new Error('Hospital not found');
  }
  res.json(hospital);
});

// PUT /api/hospital/profile
exports.updateHospitalProfile = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findOne({ user: req.user._id });
  if (!hospital) {
    res.status(404);
    throw new Error('Hospital not found');
  }
  const { hospitalId, address, location, contact } = req.body;
  hospital.hospitalId = hospitalId || hospital.hospitalId;
  hospital.address = address || hospital.address;
  hospital.location = location || hospital.location;
  hospital.contact = contact || hospital.contact;
  const updatedHospital = await hospital.save();
  res.json(updatedHospital);
});

// POST /api/hospital/requests
exports.createRequest = asyncHandler(async (req, res) => {
  const { bloodType, quantity, urgency, notes } = req.body;
  if (!bloodType || !quantity) {
    res.status(400);
    throw new Error('Blood type and quantity are required');
  }
  const hospital = await Hospital.findOne({ user: req.user._id });
  if (!hospital) {
    res.status(404);
    throw new Error('Hospital not found');
  }
  const request = await Request.create({
    hospital: hospital._id,
    bloodType,
    quantity: Number(quantity),
    urgency: urgency || 'medium',
    notes: notes || ''
  });
  res.status(201).json(request);
});

// GET /api/hospital/requests
exports.getHospitalRequests = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findOne({ user: req.user._id });
  if (!hospital) {
    res.status(404);
    throw new Error('Hospital not found');
  }
  const requests = await Request.find({ hospital: hospital._id }).sort({ createdAt: -1 });
  res.json(requests);
});

// GET /api/hospital/history
exports.getHospitalHistory = asyncHandler(async (req, res) => {
  const hospital = await Hospital.findOne({ user: req.user._id });
  if (!hospital) {
    res.status(404);
    throw new Error('Hospital not found');
  }
  const transactions = await Transaction.find({
    hospital: hospital._id,
    type: 'distribution'
  }).sort({ date: -1 });
  res.json(transactions);
});

const express = require('express');
const router = express.Router();
const { 
  loginUser, 
  getUserProfile, 
  registerDonor, 
  registerHospital,
  registerAdmin
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { donorRegistrationRules, validate } = require('../middlewares/validation');

// Login
router.post('/login', loginUser);

// Get current user profile
router.get('/me', protect, getUserProfile);

// Register donor
router.post('/register/donor', donorRegistrationRules, validate, registerDonor);

// Register hospital
router.post('/register/hospital', registerHospital);

// Register admin
router.post('/register/admin', registerAdmin);

module.exports = router;

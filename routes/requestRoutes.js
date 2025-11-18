const express = require('express');
const router = express.Router();
const { getRequests, updateRequestStatus } = require('../controllers/requestController');
const { protect, admin } = require('../middlewares/auth');

router.route('/')
  .get(protect, admin, getRequests);

router.route('/:id')
  .put(protect, admin, updateRequestStatus);

module.exports = router;

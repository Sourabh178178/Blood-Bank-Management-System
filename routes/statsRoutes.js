const express = require('express');
const router = express.Router();
const { getStatistics, getInventoryStats } = require('../controllers/statsController');
const { protect, admin } = require('../middlewares/auth');

router.get('/', protect, admin, getStatistics);
router.get('/inventory', protect, admin, getInventoryStats);

module.exports = router;

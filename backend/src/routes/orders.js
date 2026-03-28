const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getOrder,
  getUserOrders,
} = require('../controllers/orders.controller');
const { protect } = require('../middleware/auth');

// GET /api/orders
router.get('/', protect, getUserOrders);

// POST /api/orders
router.post('/', placeOrder);

// GET /api/orders/:orderNumber
router.get('/:orderNumber', getOrder);

module.exports = router;

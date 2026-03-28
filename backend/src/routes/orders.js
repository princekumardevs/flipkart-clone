const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getOrder,
} = require('../controllers/orders.controller');

// POST /api/orders
router.post('/', placeOrder);

// GET /api/orders/:orderNumber
router.get('/:orderNumber', getOrder);

module.exports = router;

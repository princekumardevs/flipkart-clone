const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/cart.controller');

// GET /api/cart/:sessionId
router.get('/:sessionId', getCart);

// POST /api/cart
router.post('/', addToCart);

// PATCH /api/cart/:id
router.patch('/:id', updateCartItem);

// DELETE /api/cart/clear/:sessionId  (must be before /:id)
router.delete('/clear/:sessionId', clearCart);

// DELETE /api/cart/:id
router.delete('/:id', removeCartItem);

module.exports = router;

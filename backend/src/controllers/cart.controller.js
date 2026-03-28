const prisma = require('../lib/prisma');

// GET /api/cart/:sessionId
const getCart = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: cartItems });
  } catch (error) {
    next(error);
  }
};

// POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { sessionId, productId, quantity = 1 } = req.body;

    if (!sessionId || !productId) {
      return res.status(400).json({ success: false, error: 'sessionId and productId are required' });
    }

    // Check if item already exists in cart
    const existing = await prisma.cartItem.findFirst({
      where: { sessionId, productId: parseInt(productId) },
    });

    let cartItem;
    if (existing) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + parseInt(quantity) },
        include: { product: true },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          sessionId,
          productId: parseInt(productId),
          quantity: parseInt(quantity),
        },
        include: { product: true },
      });
    }

    res.status(201).json({ success: true, data: cartItem });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/cart/:id
const updateCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, error: 'Quantity must be at least 1' });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id: parseInt(id) },
      data: { quantity: parseInt(quantity) },
      include: { product: true },
    });

    res.json({ success: true, data: cartItem });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/:id
const removeCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.cartItem.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/clear/:sessionId
const clearCart = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    await prisma.cartItem.deleteMany({ where: { sessionId } });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem, clearCart };

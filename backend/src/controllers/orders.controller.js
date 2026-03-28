const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');

// POST /api/orders
const placeOrder = async (req, res, next) => {
  try {
    const {
      sessionId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
    } = req.body;

    // Validate required fields
    if (!sessionId || !fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({ success: false, error: 'All required fields must be provided' });
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, error: 'Cart is empty' });
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      return sum + parseFloat(item.product.price) * item.quantity;
    }, 0);

    const deliveryCharge = subtotal >= 499 ? 0 : 40;
    const total = subtotal + deliveryCharge;
    const orderNumber = 'OD' + Date.now();

    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        userId = decoded.id;
      } catch (error) {}
    }

    // Create order with order items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber,
          sessionId,
          fullName,
          phone,
          addressLine1,
          addressLine2: addressLine2 || null,
          city,
          state,
          pincode,
          subtotal,
          deliveryCharge,
          total,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          items: { include: { product: true } },
        },
      });

      // Clear cart
      await tx.cartItem.deleteMany({ where: { sessionId } });

      return newOrder;
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:orderNumber
const getOrder = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/user
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

module.exports = { placeOrder, getOrder, getUserOrders };

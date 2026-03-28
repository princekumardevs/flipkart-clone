const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');

// Get user's wishlist
router.get('/', protect, async (req, res, next) => {
  try {
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: req.user.id },
      include: {
        product: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(wishlist);
  } catch (error) {
    next(error);
  }
});

// Toggle product in wishlist
router.post('/toggle', protect, async (req, res, next) => {
  try {
    const { productId } = req.body;
    
    // Check if already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: req.user.id,
          productId: Number(productId)
        }
      }
    });

    if (existingItem) {
      // Remove it
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id }
      });
      return res.json({ message: 'Removed from wishlist', isWishlisted: false, productId: Number(productId) });
    } else {
      // Add it
      const item = await prisma.wishlistItem.create({
        data: {
          userId: req.user.id,
          productId: Number(productId)
        },
        include: { product: true }
      });
      return res.status(201).json({ message: 'Added to wishlist', isWishlisted: true, item });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

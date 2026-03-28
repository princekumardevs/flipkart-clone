const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { protect } = require('../middleware/auth');

// Get all addresses for user
router.get('/', protect, async (req, res, next) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: addresses });
  } catch (error) {
    next(error);
  }
});

// Add new address
router.post('/', protect, async (req, res, next) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode } = req.body;
    
    const addressCount = await prisma.address.count({ where: { userId: req.user.id } });
    const isDefault = addressCount === 0;

    const address = await prisma.address.create({
      data: {
        userId: req.user.id,
        fullName,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        pincode,
        isDefault
      }
    });

    res.status(201).json({ success: true, data: address });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

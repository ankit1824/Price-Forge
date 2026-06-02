// Checkout Controller - calculate best deal
const Price = require('../models/Price');

const calculateBestDeal = async (req, res) => {
  try {
    const { cartItems } = req.body; // Array of { itemName, quantity }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Fetch prices for all items in cart
    const priceData = await Price.find({
      productName: { $in: cartItems.map(item => item.itemName) }
    });

    // Calculate totals for each platform
    const platformTotals = {
      blinkit: { total: 0, items: 0, eligible: true, deliveryFee: 0, minOrder: 0 },
      zepto: { total: 0, items: 0, eligible: true, deliveryFee: 0, minOrder: 0 },
      instamart: { total: 0, items: 0, eligible: true, deliveryFee: 0, minOrder: 0 }
    };

    const partialAvailability = [];
    const allItems = [];

    // Process each item in cart
    for (const cartItem of cartItems) {
      const priceRecord = priceData.find(p => p.productName === cartItem.itemName);

      if (!priceRecord) {
        return res.status(404).json({ error: `${cartItem.itemName} not found on any platform` });
      }

      const itemAvailability = [];

      // Check each platform
      for (const [platform, platformData] of Object.entries(priceRecord.platforms)) {
        if (platformData.availability) {
          itemAvailability.push(platform);
          platformTotals[platform].total += platformData.price * cartItem.quantity;
          platformTotals[platform].deliveryFee = platformData.deliveryFee;
          platformTotals[platform].minOrder = platformData.minOrder;
          platformTotals[platform].items += 1;
        }
      }

      if (itemAvailability.length < 3) {
        partialAvailability.push({
          itemName: cartItem.itemName,
          availableOn: itemAvailability,
          availabilityCount: `${itemAvailability.length}/3`
        });
      }

      allItems.push({
        itemName: cartItem.itemName,
        quantity: cartItem.quantity,
        availableOn: itemAvailability
      });
    }

    // Calculate final totals with delivery fees
    const platformResults = {};
    let bestDeal = null;
    let minTotal = Infinity;

    for (const [platform, data] of Object.entries(platformTotals)) {
      const finalTotal = data.total + data.deliveryFee;
      const isEligible = finalTotal >= data.minOrder;

      platformResults[platform] = {
        subtotal: data.total,
        deliveryFee: data.deliveryFee,
        minOrder: data.minOrder,
        total: finalTotal,
        eligible: isEligible
      };

      if (isEligible && finalTotal < minTotal) {
        minTotal = finalTotal;
        bestDeal = platform;
      }
    }

    res.json({
      platformResults,
      bestDeal,
      partialAvailability,
      allItems,
      disclaimer: 'Prices are fetched in real-time and may vary on actual apps'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  calculateBestDeal
};

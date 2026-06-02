// Cache management utility
const Price = require('../models/Price');
const { CACHE_DURATION } = require('./constants');

const getFromCache = async (productName) => {
  try {
    const cached = await Price.findOne({ productName });
    
    if (!cached) return null;

    // Check if cache is still valid (5 minutes)
    const lastUpdate = cached.lastUpdated || new Date(0);
    const isValid = (Date.now() - lastUpdate.getTime()) < CACHE_DURATION;

    if (isValid) {
      return cached;
    }
    return null;
  } catch (err) {
    console.error('Cache retrieval error:', err);
    return null;
  }
};

const saveToCache = async (productName, platformData) => {
  try {
    const priceRecord = await Price.findOneAndUpdate(
      { productName },
      { 
        productName,
        platforms: platformData,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );
    return priceRecord;
  } catch (err) {
    console.error('Cache save error:', err);
    return null;
  }
};

module.exports = {
  getFromCache,
  saveToCache
};

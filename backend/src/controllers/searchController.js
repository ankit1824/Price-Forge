// Search Controller - calls ML service to fetch prices
const axios = require('axios');
const { getFromCache, saveToCache } = require('../utils/cache');

const searchItems = async (req, res) => {
  try {
    const { items } = req.body; // Array of item names
    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

    // Call ML service to search and scrape
    const response = await axios.post(
      `${ML_SERVICE_URL}/api/search`,
      { items },
      { timeout: 30000 }
    );

    const { results, partialAvailability } = response.data;

    // Cache the results
    for (const result of results) {
      await saveToCache(result.productName, result.platforms);
    }

    res.json({
      results,
      partialAvailability,
      message: 'Search completed successfully'
    });
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Failed to search items' });
  }
};

module.exports = {
  searchItems
};

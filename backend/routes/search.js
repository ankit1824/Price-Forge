import express from 'express'
import axios from 'axios'
import PriceCache from '../models/PriceCache.js'

const router = express.Router()
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000'

// Search for multiple items
router.post('/search', async (req, res) => {
  try {
    const { items } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items array required' })
    }

    const results = []

    for (const item of items) {
      try {
        // Check cache first
        let cachedPrice = await PriceCache.findOne({
          normalizedName: item.name.toLowerCase()
        })

        if (cachedPrice) {
          results.push({
            name: item.name,
            quantity: item.quantity,
            prices: cachedPrice.prices,
            availability: cachedPrice.availability,
            fromCache: true
          })
        } else {
          // Fetch from ML service for product matching
          const matchResponse = await axios.post(`${ML_SERVICE_URL}/api/match-product`, {
            productName: item.name
          })

          const normalizedProduct = matchResponse.data.normalizedName

          // Fetch prices from scraper
          const priceResponse = await axios.post(`${ML_SERVICE_URL}/api/scrape-prices`, {
            productName: normalizedProduct,
            platforms: ['blinkit', 'zepto', 'instamart']
          })

          const priceData = priceResponse.data

          // Cache the prices
          const newCache = new PriceCache({
            itemName: item.name,
            normalizedName: normalizedProduct.toLowerCase(),
            prices: priceData.prices,
            availability: priceData.availability,
            lastScrapedAt: new Date()
          })

          await newCache.save()

          results.push({
            name: item.name,
            quantity: item.quantity,
            prices: priceData.prices,
            availability: priceData.availability,
            fromCache: false
          })
        }
      } catch (itemError) {
        console.error(`Error processing item ${item.name}:`, itemError.message)
        results.push({
          name: item.name,
          quantity: item.quantity,
          prices: {
            blinkit: null,
            zepto: null,
            instamart: null
          },
          availability: {
            blinkit: false,
            zepto: false,
            instamart: false
          },
          error: 'Could not fetch prices for this item'
        })
      }
    }

    res.json({
      items: results,
      timestamp: new Date(),
      totalItems: items.length,
      disclaimer: 'Prices are fetched in real-time and may vary on original apps. Accuracy margin: ±2 rupees'
    })
  } catch (error) {
    res.status(500).json({ message: 'Search failed', error: error.message })
  }
})

// Get suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.length < 2) {
      return res.json({ suggestions: [] })
    }

    // Call ML service for suggestions
    const response = await axios.get(`${ML_SERVICE_URL}/api/suggestions`, {
      params: { q }
    })

    res.json({ suggestions: response.data.suggestions })
  } catch (error) {
    res.json({ suggestions: [] })
  }
})

export default router
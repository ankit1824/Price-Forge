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
        // Fetch from ML service first to get normalized name (handles typos/synonyms)
        const matchResponse = await axios.post(`${ML_SERVICE_URL}/api/match-product`, {
          productName: item.name
        })

        const normalizedProduct = matchResponse.data.normalizedName
        const confidence = matchResponse.data.confidence

        // Now check cache with normalized name
        let cachedPrice = await PriceCache.findOne({
          normalizedName: normalizedProduct.toLowerCase()
        })

        if (cachedPrice) {
          results.push({
            name: normalizedProduct, // Use normalized name for UI consistency
            originalSearch: item.name,
            quantity: item.quantity || 1,
            prices: cachedPrice.prices,
            availability: cachedPrice.availability,
            fromCache: true
          })
        } else {
          // Cache miss: Fetch prices from scraper
          const priceResponse = await axios.post(`${ML_SERVICE_URL}/api/scrape-prices`, {
            productName: normalizedProduct,
            platforms: ['blinkit', 'zepto', 'instamart']
          })

          const priceData = priceResponse.data

          // Cache the prices
          const newCache = new PriceCache({
            itemName: item.name.toLowerCase(),
            normalizedName: normalizedProduct.toLowerCase(),
            prices: priceData.prices,
            availability: priceData.availability,
            lastScrapedAt: new Date()
          })

          await newCache.save()

          results.push({
            name: normalizedProduct,
            originalSearch: item.name,
            quantity: item.quantity || 1,
            prices: priceData.prices,
            availability: priceData.availability,
            fromCache: false
          })
        }
      } catch (itemError) {
        console.error(`Error processing item ${item.name}:`, itemError.message)
        results.push({
          name: item.name,
          originalSearch: item.name,
          quantity: item.quantity || 1,
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

    // Call ML service to calculate the overall best deal scoring
    let dealAnalysis = null
    try {
      const dealResponse = await axios.post(`${ML_SERVICE_URL}/api/calculate-best-deal`, {
        items: results
      })
      dealAnalysis = dealResponse.data
    } catch (dealError) {
      console.error('Error calling calculate-best-deal:', dealError.message)
      
      // Node-side fallback calculation if ML service is having trouble
      dealAnalysis = {
        platformResults: {
          blinkit: { subtotal: 0, deliveryFee: 15, total: 0, availableCount: 0, totalCount: results.length, missingItems: [] },
          zepto: { subtotal: 0, deliveryFee: 20, total: 0, availableCount: 0, totalCount: results.length, missingItems: [] },
          instamart: { subtotal: 0, deliveryFee: 19, total: 0, availableCount: 0, totalCount: results.length, missingItems: [] }
        },
        bestDeal: null,
        disclaimer: 'Prices calculated on backend fallback.'
      }
      
      results.forEach(res => {
        ['blinkit', 'zepto', 'instamart'].forEach(p => {
          if (res.availability[p] && res.prices[p]) {
            dealAnalysis.platformResults[p].subtotal += res.prices[p].price * res.quantity
            dealAnalysis.platformResults[p].availableCount++
          } else {
            dealAnalysis.platformResults[p].missingItems.push(res.name)
          }
        })
      })

      let maxAvail = 0
      let minCost = Infinity
      
      Object.keys(dealAnalysis.platformResults).forEach(p => {
        const platform = dealAnalysis.platformResults[p]
        if (platform.availableCount > 0) {
          platform.total = platform.subtotal + platform.deliveryFee
          if (platform.availableCount > maxAvail) {
            maxAvail = platform.availableCount
            minCost = platform.total
            dealAnalysis.bestDeal = p
          } else if (platform.availableCount === maxAvail && platform.total < minCost) {
            minCost = platform.total
            dealAnalysis.bestDeal = p
          }
        }
      })
    }

    res.json({
      items: results,
      analysis: dealAnalysis,
      timestamp: new Date(),
      totalItems: items.length,
      disclaimer: 'Prices are fetched in real-time and may vary on original apps. Accuracy margin: ±2 rupees'
    })
  } catch (error) {
    console.error('❌ Search endpoint crashed:', error)
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

// Diagnostic route to test connection to ML Service
router.get('/test-ml', async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE_URL}/health`, { timeout: 5000 })
    res.json({ 
      success: true, 
      message: 'Node.js backend successfully connected to FastAPI ML service!',
      urlConnected: `${ML_SERVICE_URL}/health`,
      response: response.data
    })
  } catch (error) {
    res.json({ 
      success: false, 
      message: 'Connection to ML Service failed',
      urlAttempted: `${ML_SERVICE_URL}/health`,
      error: error.message
    })
  }
})

export default router

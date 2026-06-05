import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// Get user cart
router.get('/cart', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      cartItems: user.savedCarts,
      favorites: user.favorites
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message })
  }
})

// Get account data
router.get('/account', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      name: user.name,
      email: user.email,
      searchHistory: user.searchHistory.map(h => h.items.join(', ')).slice(0, 10),
      priceAlerts: user.priceAlerts,
      savedCarts: user.savedCarts
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching account data', error: error.message })
  }
})

// Add to favorites
router.post('/favorites', async (req, res) => {
  try {
    const { itemName } = req.body
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { favorites: itemName } },
      { new: true }
    )

    res.json({ favorites: user.favorites })
  } catch (error) {
    res.status(500).json({ message: 'Error adding favorite', error: error.message })
  }
})

// Save search to history
router.post('/search-history', async (req, res) => {
  try {
    const { items } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        $push: {
          searchHistory: {
            items,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    )

    res.json({ message: 'Search saved' })
  } catch (error) {
    res.status(500).json({ message: 'Error saving search', error: error.message })
  }
})

export default router
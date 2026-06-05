import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// Save cart (no auth needed for quick save)
router.post('/save', async (req, res) => {
  try {
    const { items, userId } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items required' })
    }

    // If user is logged in, save to their account
    if (userId) {
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            savedCarts: {
              items,
              createdAt: new Date()
            }
          }
        },
        { new: true }
      )

      return res.json({ message: 'Cart saved', cart: user.savedCarts })
    }

    // Otherwise, just return success (frontend will store locally)
    res.json({ message: 'Cart prepared for checkout' })
  } catch (error) {
    res.status(500).json({ message: 'Error saving cart', error: error.message })
  }
})

export default router
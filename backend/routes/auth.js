import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' })
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password
    })

    await user.save()

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    )

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    )

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
})

export default router
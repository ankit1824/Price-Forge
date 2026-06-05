import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import searchRoutes from './routes/search.js'
import userRoutes from './routes/user.js'
import cartRoutes from './routes/cart.js'
import { authenticateToken } from './middlewares/auth.js'

dotenv.config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/priceforge')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// Routes
app.use('/auth', authRoutes)
app.use('/search', searchRoutes)
app.use('/user', authenticateToken, userRoutes)
app.use('/cart', cartRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`)
})
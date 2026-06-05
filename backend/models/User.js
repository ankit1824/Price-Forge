import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  favorites: [String],
  searchHistory: [
    {
      query: String,
      items: [String],
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  savedCarts: [
    {
      name: String,
      items: [
        {
          name: String,
          quantity: Number
        }
      ],
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  priceAlerts: [
    {
      itemName: String,
      targetPrice: Number,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password)
}

export default mongoose.model('User', userSchema)
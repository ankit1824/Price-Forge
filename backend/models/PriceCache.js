import mongoose from 'mongoose'

const priceCacheSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  normalizedName: String,
  prices: {
    blinkit: {
      price: Number,
      deliveryFee: Number,
      minimumOrder: Number,
      buyLink: String,
      lastUpdated: Date
    },
    zepto: {
      price: Number,
      deliveryFee: Number,
      minimumOrder: Number,
      buyLink: String,
      lastUpdated: Date
    },
    instamart: {
      price: Number,
      deliveryFee: Number,
      minimumOrder: Number,
      buyLink: String,
      lastUpdated: Date
    }
  },
  availability: {
    blinkit: Boolean,
    zepto: Boolean,
    instamart: Boolean
  },
  lastScrapedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 60 * 1000), // 30 minutes TTL
    index: { expireAfterSeconds: 0 } // MongoDB will delete after expiresAt time
  }
})

export default mongoose.model('PriceCache', priceCacheSchema)
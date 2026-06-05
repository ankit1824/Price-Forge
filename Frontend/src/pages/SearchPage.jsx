import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import SearchBar from '../components/SearchBar'
import CartPreview from '../components/CartPreview'

export default function SearchPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)

  const handleAddItem = (itemName, quantity = 1) => {
    const existingItem = cart.find(item => item.name.toLowerCase() === itemName.toLowerCase())
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.name.toLowerCase() === itemName.toLowerCase()
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ))
    } else {
      setCart([...cart, { name: itemName, quantity }])
    }
  }

  const handleSearch = async () => {
    if (cart.length === 0) {
      alert('Please add at least one item to search')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('/api/search', { items: cart })
      navigate('/results', { state: { results: response.data, cart } })
    } catch (error) {
      alert('Error searching prices: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = (itemName) => {
    setCart(cart.filter(item => item.name !== itemName))
  }

  const handleUpdateQuantity = (itemName, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(itemName)
    } else {
      setCart(cart.map(item =>
        item.name === itemName ? { ...item, quantity } : item
      ))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Find the Best Prices for Your Groceries
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Compare prices across Blinkit, Zepto, and Instamart instantly. Add multiple items and find the best total deal.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search Section */}
          <div className="lg:col-span-2">
            <SearchBar onAddItem={handleAddItem} />
          </div>

          {/* Cart Preview */}
          <div>
            <CartPreview
              items={cart}
              onRemove={handleRemoveItem}
              onUpdateQuantity={handleUpdateQuantity}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="text-lg font-bold mb-2">Real-Time Prices</h3>
            <p className="text-gray-600">Get live prices directly from Blinkit, Zepto, and Instamart every time you search.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">🛒</div>
            <h3 className="text-lg font-bold mb-2">Smart Cart</h3>
            <p className="text-gray-600">Add multiple items and compare total prices across all platforms instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="text-lg font-bold mb-2">Save Money</h3>
            <p className="text-gray-600">Get smart recommendations on which platform gives you the best overall deal.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
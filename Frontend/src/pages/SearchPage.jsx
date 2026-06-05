import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function SearchPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [searchInput, setSearchInput] = useState('')

  const handleAddItem = (itemName) => {
    if (itemName.trim()) {
      const existingItem = cart.find(item => item.name.toLowerCase() === itemName.toLowerCase())
      if (existingItem) {
        setCart(cart.map(item =>
          item.name.toLowerCase() === itemName.toLowerCase()
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      } else {
        setCart([...cart, { name: itemName, quantity: 1 }])
      }
      setSearchInput('')
    }
  }

  const handleRemoveItem = (itemName) => {
    setCart(cart.filter(item => item.name !== itemName))
  }

  const handleSearch = async () => {
    if (cart.length === 0) {
      alert('Please add at least one item to search')
      return
    }
    navigate('/results', { state: { results: { items: [] }, cart } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Find the Best Prices for Your Groceries
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Compare prices across Blinkit, Zepto, and Instamart instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Add Items to Cart</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem(searchInput)}
                  placeholder="Search for items (e.g., Atta, Milk, Oil...)"
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
                />
                <button
                  onClick={() => handleAddItem(searchInput)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Cart ({cart.length})</h2>
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {cart.length > 0 ? (
                cart.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-6">Add items to get started</p>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={cart.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              Compare Prices
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

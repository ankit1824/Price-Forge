import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function CartPage() {
  const [savedCart, setSavedCart] = useState([])
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      fetchUserData()
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get('/api/user/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSavedCart(response.data.cartItems || [])
      setFavorites(response.data.favorites || [])
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Saved Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Saved Carts */}
        <div className="lg:col-span-2">
          {savedCart.length > 0 ? (
            <div className="space-y-4">
              {savedCart.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <button className="text-purple-600 hover:text-purple-700">View Price</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600">Your cart is empty. Start searching for items!</p>
            </div>
          )}
        </div>

        {/* Favorites */}
        <div>
          <h2 className="text-xl font-bold mb-4">Favorites</h2>
          {favorites.length > 0 ? (
            <div className="space-y-2">
              {favorites.map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="font-semibold text-sm">{item}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No favorites yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
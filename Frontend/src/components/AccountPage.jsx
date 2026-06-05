import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function AccountPage({ user }) {
  const [searchHistory, setSearchHistory] = useState([])
  const [priceAlerts, setPriceAlerts] = useState([])

  useEffect(() => {
    fetchAccountData()
  }, [])

  const fetchAccountData = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get('/api/user/account', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSearchHistory(response.data.searchHistory || [])
      setPriceAlerts(response.data.priceAlerts || [])
    } catch (error) {
      console.error('Error fetching account data:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Name</p>
              <p className="text-lg font-bold">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-lg font-bold">{user?.email}</p>
            </div>
            <button className="w-full mt-6 px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition">
              Edit Profile
            </button>
          </div>
        </div>

        {/* Search History */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">Recent Searches</h3>
            {searchHistory.length > 0 ? (
              <div className="space-y-2">
                {searchHistory.slice(0, 5).map((search, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-purple-50 transition"
                  >
                    <p className="font-semibold text-gray-900">{search}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No search history yet</p>
            )}
          </div>

          {/* Price Alerts */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4">Price Alerts (Premium)</h3>
            {priceAlerts.length > 0 ? (
              <div className="space-y-3">
                {priceAlerts.map((alert, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-semibold text-gray-900">{alert.itemName}</p>
                    <p className="text-sm text-gray-600">Alert when price drops below ₹{alert.targetPrice}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No price alerts set</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
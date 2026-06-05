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
      // const response = await axios.get('/api/user/account', {
      //   headers: { Authorization: `Bearer ${token}` }
      // })
      // setSearchHistory(response.data.searchHistory || [])
      // setPriceAlerts(response.data.priceAlerts || [])
    } catch (error) {
      console.error('Error fetching account data:', error)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 text-sm">Name</p>
              <p className="text-lg font-bold">{user?.name || 'User'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-lg font-bold">{user?.email || 'email@example.com'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [results, setResults] = useState(location.state?.results || null)
  const [cart, setCart] = useState(location.state?.cart || [])

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Back to Search
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2 text-purple-600 hover:text-purple-700"
      >
        ← Back to Search
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6">Price Comparison Results</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600">Results will appear here</p>
          </div>
        </div>
      </div>
    </div>
  )
}

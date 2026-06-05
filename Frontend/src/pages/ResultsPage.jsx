import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PriceComparison from '../components/PriceComparison'
import CartTotal from '../components/CartTotal'

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
        {/* Main Results */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold mb-6">Price Comparison Results</h2>
          {results.items && results.items.length > 0 ? (
            <div className="space-y-6">
              {results.items.map((item, idx) => (
                <PriceComparison key={idx} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
              <p className="text-yellow-800">No results found. Please try different items.</p>
            </div>
          )}
        </div>

        {/* Cart Total Summary */}
        <div>
          <CartTotal items={cart} results={results} />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-12 bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-blue-900 text-sm">
          <strong>⚠️ Disclaimer:</strong> Prices are fetched in real-time and may vary on original apps. 
          Always verify prices on the respective platforms before making a purchase. We maintain ±2 rupees accuracy margin.
        </p>
      </div>
    </div>
  )
} 
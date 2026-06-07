import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  
  const cart = location.state?.cart || []

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/')
      return
    }

    const fetchPrices = async () => {
      setLoading(true)
      try {
        const response = await axios.post('/api/search/search', {
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity
          }))
        })
        setData(response.data)
      } catch (err) {
        console.error('Error fetching comparisons:', err)
        setError('Failed to fetch price comparisons. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
  }, [cart, navigate])

  if (cart.length === 0) return null

  // Helper for platform branding colors
  const getPlatformColors = (platform) => {
    switch (platform) {
      case 'blinkit':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          accent: 'bg-yellow-500',
          brandText: 'text-yellow-900',
          logoColor: 'text-[#ffd300]',
          name: 'Blinkit'
        }
      case 'zepto':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          text: 'text-rose-700',
          accent: 'bg-rose-600',
          brandText: 'text-rose-900',
          logoColor: 'text-[#ec4899]',
          name: 'Zepto'
        }
      case 'instamart':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-700',
          accent: 'bg-orange-500',
          brandText: 'text-orange-950',
          logoColor: 'text-[#ff6600]',
          name: 'Instamart'
        }
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-700',
          accent: 'bg-slate-500',
          brandText: 'text-slate-900',
          logoColor: 'text-slate-500',
          name: platform
        }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 grid-bg-pattern py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Navigation / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="self-start flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-purple-600 bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm hover-scale"
          >
            ← Back to List
          </button>
          
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Price Comparison Results</span>
            <span className="text-xs text-slate-500">Fetched in real-time</span>
          </div>
        </div>

        {/* Loading Skeleton State */}
        {loading && (
          <div className="space-y-8 animate-pulse">
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white/80 border border-slate-100 p-6 rounded-2xl h-56 shimmer-bg" />
              ))}
            </div>
            <div className="bg-white border border-slate-100 p-6 rounded-2xl h-80 shimmer-bg" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-card border-red-100 p-8 rounded-2xl text-center shadow-lg max-w-lg mx-auto">
            <span className="text-4xl">⚠️</span>
            <h3 className="text-lg font-bold text-slate-800 mt-4">Unable to compare prices</h3>
            <p className="text-slate-600 text-sm mt-2">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm hover-scale"
            >
              Back to List
            </button>
          </div>
        )}

        {/* Content State */}
        {!loading && !error && data && (
          <div className="space-y-8">
            
            {/* Title / Summary */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Your Comparison <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-slate-600 font-medium text-sm mt-1">
                Found matches for {data.totalItems} items. Best pricing is highlighted.
              </p>
            </div>

            {/* Platform Comparison Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {Object.keys(data.analysis.platformResults).map((platform) => {
                const colors = getPlatformColors(platform)
                const result = data.analysis.platformResults[platform]
                const isBest = data.analysis.bestDeal === platform

                return (
                  <div
                    key={platform}
                    className={`glass-card p-6 rounded-2xl shadow-md border relative transition-all duration-300 ${
                      isBest
                        ? 'ring-2 ring-purple-600 ring-offset-2 border-purple-200 bg-white'
                        : 'border-slate-200'
                    }`}
                  >
                    {isBest && (
                      <span className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xxs font-extrabold rounded-full uppercase tracking-wider shadow-md">
                        🏆 Best Deal
                      </span>
                    )}

                    {/* Logo/Header */}
                    <div className="flex items-center justify-between mb-4 mt-1">
                      <span className={`text-xl font-bold ${colors.brandText}`}>
                        {colors.name}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {result.availableCount}/{result.totalCount} items
                      </span>
                    </div>

                    {result.eligible ? (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>Subtotal:</span>
                          <span className="font-medium">₹{result.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                          <span>Delivery Fee:</span>
                          <span className="font-medium">₹{result.deliveryFee}</span>
                        </div>
                        <div className="border-t border-slate-100 pt-3 flex justify-between items-baseline">
                          <span className="font-bold text-slate-800 text-sm">Total Sum:</span>
                          <span className="text-2xl font-extrabold text-slate-900">
                            ₹{result.total}
                          </span>
                        </div>

                        {/* Missing items display */}
                        {result.missingItems.length > 0 && (
                          <div className="mt-4 pt-3 border-t border-slate-100">
                            <span className="text-xxs font-bold text-rose-500 uppercase tracking-wider block mb-1">
                              Unavailable items ({result.missingItems.length})
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {result.missingItems.map((item, i) => (
                                <span key={i} className="text-xxs bg-rose-50 text-rose-600 px-2 py-0.5 rounded border border-rose-100 truncate max-w-[150px]">
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-slate-400">
                        <span className="text-2xl">❌</span>
                        <p className="text-sm font-semibold mt-2">All items out of stock</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Side-by-Side Product comparison table */}
            <div className="glass-card rounded-2xl shadow-lg border border-slate-200 overflow-hidden bg-white">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Side-by-Side Item Prices</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                      <th className="py-4 px-6">Product Details</th>
                      <th className="py-4 px-4 text-center">Blinkit</th>
                      <th className="py-4 px-4 text-center">Zepto</th>
                      <th className="py-4 px-4 text-center">Instamart</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-6">
                          <p className="font-semibold text-slate-800 text-sm leading-tight">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-slate-400 text-xs font-medium">Qty: {item.quantity}</span>
                            {item.fromCache && (
                              <span className="text-xxs bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold border border-emerald-100">
                                Cached
                              </span>
                            )}
                          </div>
                        </td>
                        
                        {/* Platforms */}
                        {['blinkit', 'zepto', 'instamart'].map((platform) => {
                          const isAvail = item.availability[platform]
                          const priceDetails = item.prices[platform]
                          const colors = getPlatformColors(platform)

                          return (
                            <td key={platform} className="py-4 px-4 text-center">
                              {isAvail && priceDetails ? (
                                <div className="space-y-1.5 inline-block">
                                  <p className="text-sm font-bold text-slate-800">
                                    ₹{priceDetails.price}
                                  </p>
                                  <a
                                    href={priceDetails.buyLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`inline-flex items-center gap-1 text-xxs font-extrabold text-white px-2.5 py-1 rounded shadow-sm hover:opacity-90 ${colors.accent}`}
                                  >
                                    Buy Now ↗
                                  </a>
                                </div>
                              ) : (
                                <span className="text-xxs bg-rose-50 text-rose-500 border border-rose-100 px-2.5 py-1 rounded font-bold uppercase tracking-wider inline-block">
                                  Out of Stock
                                </span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Disclaimer and Info */}
            <div className="text-center text-xs text-slate-400 leading-relaxed bg-white border border-slate-200/80 p-4 rounded-xl max-w-2xl mx-auto shadow-inner">
              <span className="font-bold text-slate-500">Disclaimer: </span>
              {data.disclaimer || 'Prices are fetched in real-time and may vary on original apps.'}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}


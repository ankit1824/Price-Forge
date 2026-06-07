import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const POPULAR_ITEMS = [
  { name: 'Aashirvaad Atta 1kg', icon: '🌾' },
  { name: 'Amul Milk 500ml', icon: '🥛' },
  { name: 'Maggi Noodles', icon: '🍜' },
  { name: 'Tata Salt 1kg', icon: '🧂' },
  { name: 'Curd 500ml', icon: '🍯' },
  { name: 'Onion 1kg', icon: '🧅' }
]

export default function SearchPage() {
  const navigate = useNavigate()
  
  // Load initial cart from localStorage or start empty
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('priceforge_cart')
    return saved ? JSON.parse(saved) : []
  })
  
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionRef = useRef(null)

  // Sync cart to local storage
  useEffect(() => {
    localStorage.setItem('priceforge_cart', JSON.stringify(cart))
  }, [cart])

  // Handle autocomplete fetch
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.trim().length < 2) {
        setSuggestions([])
        return
      }
      try {
        const response = await axios.get(`/api/search/suggestions`, {
          params: { q: searchInput }
        })
        setSuggestions(response.data.suggestions || [])
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    }

    const delayDebounce = setTimeout(() => {
      fetchSuggestions()
    }, 250) // Debounce requests

    return () => clearTimeout(delayDebounce)
  }, [searchInput])

  // Close suggestions dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        setCart([...cart, { name: itemName.trim(), quantity: 1 }])
      }
      setSearchInput('')
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleIncreaseQty = (itemName) => {
    setCart(cart.map(item =>
      item.name === itemName ? { ...item, quantity: item.quantity + 1 } : item
    ))
  }

  const handleDecreaseQty = (itemName) => {
    setCart(cart.map(item => {
      if (item.name === itemName) {
        return { ...item, quantity: Math.max(1, item.quantity - 1) }
      }
      return item
    }))
  }

  const handleRemoveItem = (itemName) => {
    setCart(cart.filter(item => item.name !== itemName))
  }

  const handleClearCart = () => {
    setCart([])
  }

  const handleSearch = () => {
    if (cart.length === 0) {
      alert('Please add at least one item to search')
      return
    }
    // Navigate to results and pass cart
    navigate('/results', { state: { cart } })
  }

  return (
    <div className="min-h-screen bg-slate-50 grid-bg-pattern py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Hero Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-6 hover-scale">
            ✨ Smart Price Comparison for Quick Commerce
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-none mb-6">
            Forge the Best Deals on <span className="gradient-text">Groceries</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 font-medium">
            No more switching apps. Compare Blinkit, Zepto, and Instamart side-by-side and see the sum total instantly.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Search Column */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-6 rounded-2xl shadow-xl relative">
              <h2 className="text-xl font-bold mb-4 text-slate-800 flex items-center gap-2">
                <span>🛒</span> Add Grocery Items
              </h2>
              
              <div className="relative" ref={suggestionRef}>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => {
                      setSearchInput(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddItem(searchInput)}
                    placeholder="Search e.g. Atta, Milk, Maggi, Bread..."
                    className="flex-1 px-5 py-4 border border-slate-200 bg-white/80 rounded-xl focus:outline-none text-slate-800 text-base shadow-inner"
                  />
                  <button
                    onClick={() => handleAddItem(searchInput)}
                    className="px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-lg font-bold text-sm hover-scale"
                  >
                    Add to List
                  </button>
                </div>

                {/* Autocomplete Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl z-30 overflow-hidden divide-y divide-slate-100">
                    {suggestions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAddItem(item)}
                        className="w-full px-5 py-3.5 text-left text-sm text-slate-700 hover:bg-purple-50 transition flex items-center justify-between"
                      >
                        <span className="font-medium">{item}</span>
                        <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2 py-0.5 rounded">Select</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Popular Items Row */}
            <div className="glass-card p-6 rounded-2xl shadow-xl">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Popular Quick-Add Items
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {POPULAR_ITEMS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddItem(item.name)}
                    className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 flex items-center gap-2 shadow-sm hover-scale"
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Column */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 rounded-2xl shadow-xl sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span>📋</span> Shopping List
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {cart.length}
                  </span>
                </h2>
                {cart.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-3 mb-6 max-h-[360px] overflow-y-auto pr-1">
                {cart.length > 0 ? (
                  cart.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white border border-slate-100 p-3.5 rounded-xl shadow-sm hover:border-purple-100 hover:shadow transition-all duration-300"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <p className="font-semibold text-sm text-slate-800 truncate">{item.name}</p>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {/* Qty controls */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            onClick={() => handleDecreaseQty(item.name)}
                            className="px-2.5 py-1 text-slate-500 hover:bg-slate-200 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-700 w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncreaseQty(item.name)}
                            className="px-2.5 py-1 text-slate-500 hover:bg-slate-200 font-bold"
                          >
                            +
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.name)}
                          className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                    <span className="text-4xl">🛒</span>
                    <p className="text-slate-400 text-sm mt-3 font-medium">Your shopping list is empty</p>
                    <p className="text-slate-300 text-xs mt-1">Add items above to compare prices</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleSearch}
                disabled={cart.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-600/10 hover:shadow-xl hover:shadow-purple-600/20 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none hover-scale"
              >
                ⚡ Compare Total Prices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


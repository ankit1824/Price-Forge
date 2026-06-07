import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function CartPage() {
  const navigate = useNavigate()
  const [savedCarts, setSavedCarts] = useState([])
  const [loading, setLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      setIsLoggedIn(true)
      fetchSavedCarts(token)
    }
  }, [])

  const fetchSavedCarts = async (token) => {
    setLoading(true)
    try {
      const response = await axios.get('/api/user/account', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setSavedCarts(response.data.savedCarts || [])
    } catch (error) {
      console.error('Error fetching saved carts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLoadCart = (cartItems) => {
    // Map backend saved item format to frontend active cart format
    const activeCart = cartItems.map(item => ({
      name: item.name,
      quantity: item.quantity
    }))
    localStorage.setItem('priceforge_cart', JSON.stringify(activeCart))
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-50 grid-bg-pattern py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My <span className="gradient-text">Saved Lists</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Load past lists to instantly compare current prices across platforms.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-sm font-semibold text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2.5 rounded-xl border border-purple-100 shadow-sm hover-scale"
          >
            Create New List +
          </button>
        </div>

        {!isLoggedIn ? (
          <div className="glass-card p-10 rounded-2xl text-center shadow-lg border border-slate-200 max-w-lg mx-auto">
            <span className="text-5xl">🔒</span>
            <h3 className="text-lg font-bold text-slate-800 mt-4">Login to save your lists</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
              Register or login to save your custom shopping lists to your profile so you can search them anytime!
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover-scale"
            >
              Sign In / Sign Up
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map(n => (
              <div key={n} className="bg-white/80 p-6 rounded-2xl h-36 border border-slate-100 shimmer-bg" />
            ))}
          </div>
        ) : savedCarts.length > 0 ? (
          <div className="space-y-4">
            {savedCarts.map((cart, idx) => (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-purple-200 hover:shadow-md transition-all duration-300"
              >
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    {cart.name || `Shopping List #${idx + 1}`}
                  </h3>
                  <p className="text-xxs font-semibold text-slate-400 mt-0.5">
                    Saved on {new Date(cart.createdAt).toLocaleDateString()}
                  </p>
                  
                  {/* Items list inline */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {cart.items.map((item, i) => (
                      <span
                        key={i}
                        className="text-xs bg-slate-100 border border-slate-200/50 text-slate-600 px-2.5 py-0.5 rounded-lg font-medium"
                      >
                        {item.name} (x{item.quantity})
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleLoadCart(cart.items)}
                  className="self-start md:self-center px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow hover-scale flex items-center gap-1.5"
                >
                  <span>⚡</span> Load List
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 rounded-2xl text-center border border-slate-200/80 shadow bg-white">
            <span className="text-4xl">📋</span>
            <p className="text-slate-800 font-bold mt-4">No saved lists found</p>
            <p className="text-slate-500 text-sm mt-1">
              Start by building a shopping cart on the homepage and click compare!
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm hover-scale"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


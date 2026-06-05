import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ isLoggedIn, user, onLogout }) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">₹F</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PriceForge</span>
          </Link>

          {/* Center - Navigation Links */}
          <div className="hidden md:flex gap-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 transition">Home</Link>
            {isLoggedIn && (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-purple-600 transition">My Cart</Link>
                <Link to="/account" className="text-gray-700 hover:text-purple-600 transition">Account</Link>
              </>
            )}
          </div>

          {/* Right - Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative">
              <svg className="w-6 h-6 text-gray-700 hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </Link>

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  {user?.name?.charAt(0) || 'U'}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
                    <button
                      onClick={() => {
                        navigate('/account')
                        setMenuOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        onLogout()
                        setMenuOpen(false)
                        navigate('/')
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
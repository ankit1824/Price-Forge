import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import SearchPage from './pages/SearchPage'
import CartPage from './pages/CartPage'
import ResultsPage from './pages/ResultsPage'
import AuthPage from './pages/AuthPage'
import AccountPage from './pages/AccountPage'
import './styles/index.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in on app load
    const token = localStorage.getItem('authToken')
    if (token) {
      setIsLoggedIn(true)
      // Fetch user data
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      setUser(userData)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/auth" element={<AuthPage setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
          {isLoggedIn && <Route path="/account" element={<AccountPage user={user} />} />}
        </Routes>
      </div>
    </Router>
  )
}

export default App
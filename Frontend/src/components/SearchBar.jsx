import React, { useState, useRef } from 'react'
import axios from 'axios'

export default function SearchBar({ onAddItem }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const suggestionsRef = useRef(null)

  const handleSearchInput = async (value) => {
    setSearchTerm(value)

    if (value.length > 2) {
      try {
        const response = await axios.get(`/api/suggestions?q=${value}`)
        setSuggestions(response.data.suggestions || [])
        setShowSuggestions(true)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleAddItem = (itemName) => {
    if (itemName.trim()) {
      onAddItem(itemName, 1)
      setSearchTerm('')
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddItem(searchTerm)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Add Items to Cart</h2>

      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for grocery items (e.g., Atta, Milk, Oil...)"
            className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 transition"
          />
          <button
            onClick={() => handleAddItem(searchTerm)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
          >
            Add
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div ref={suggestionsRef} className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleAddItem(item)}
                className="w-full text-left px-4 py-2 hover:bg-purple-50 border-b last:border-b-0"
              >
                <p className="font-semibold text-gray-900">{item}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 mt-3">
        💡 Tip: Add multiple items to get the best total price comparison across platforms
      </p>
    </div>
  )
}
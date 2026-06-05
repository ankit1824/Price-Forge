import React, { useState } from 'react'
import axios from 'axios'

export default function CartPage() {
  const [savedCart, setSavedCart] = useState([])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Saved Cart</h1>
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <p className="text-gray-600">Your cart is empty. Start searching for items!</p>
      </div>
    </div>
  )
}

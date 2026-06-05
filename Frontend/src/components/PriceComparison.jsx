import React from 'react'

export default function PriceComparison({ item }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold">{item?.name || 'Item'}</h3>
      <p className="text-gray-600 mt-2">Prices will load here</p>
    </div>
  )
}

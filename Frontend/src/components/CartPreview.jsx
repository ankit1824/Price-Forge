import React from 'react'

export default function CartPreview({ items, onRemove, onUpdateQuantity, onSearch, loading }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
      <h2 className="text-2xl font-bold mb-4">Cart ({items.length})</h2>
      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold text-sm">{item.name}</p>
              <button onClick={() => onRemove(item.name)} className="text-red-600">✕</button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">Add items</p>
        )}
      </div>
      <button
        onClick={onSearch}
        disabled={items.length === 0 || loading}
        className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Searching...' : 'Compare Prices'}
      </button>
    </div>
  )
}

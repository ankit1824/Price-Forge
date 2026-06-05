import React from 'react'

export default function CartPreview({ items, onRemove, onUpdateQuantity, onSearch, loading }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
      <h2 className="text-2xl font-bold mb-4">Cart ({items.length})</h2>

      <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => onUpdateQuantity(item.name, item.quantity - 1)}
                    className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    −
                  </button>
                  <span className="text-xs font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.name, item.quantity + 1)}
                    className="text-xs px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                onClick={() => onRemove(item.name)}
                className="text-red-600 hover:text-red-700 ml-2"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center py-6">Add items to get started</p>
        )}
      </div>

      <button
        onClick={onSearch}
        disabled={items.length === 0 || loading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Searching...' : 'Compare Prices'}
      </button>
    </div>
  )
}
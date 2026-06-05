import React from 'react'

const platformLogos = {
  'blinkit': '⚡',
  'zepto': '🚀',
  'instamart': '🏪'
}

export default function PriceComparison({ item }) {
  if (!item || !item.prices) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-yellow-800">Item not available on any platform</p>
      </div>
    )
  }

  const availablePrices = Object.entries(item.prices).filter(([_, price]) => price !== null)
  const bestPrice = Math.min(...availablePrices.map(([_, p]) => p.price))
  const bestPlatform = availablePrices.find(([_, p]) => p.price === bestPrice)?.[0]

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Item Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
        <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
      </div>

      {/* Price Grid */}
      <div className="p-4">
        {availablePrices.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-4">
            {availablePrices.map(([platform, priceData]) => (
              <div
                key={platform}
                className={`p-4 rounded-lg border-2 transition ${
                  platform === bestPlatform
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{platformLogos[platform] || '🛒'}</span>
                  <span className="font-bold text-gray-900 capitalize">{platform}</span>
                  {platform === bestPlatform && (
                    <span className="ml-auto bg-green-500 text-white text-xs px-2 py-1 rounded">Best</span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price per unit:</span>
                    <span className="font-bold text-lg">₹{priceData.price.toFixed(2)}</span>
                  </div>

                  {priceData.deliveryFee !== undefined && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Delivery Fee:</span>
                      <span className="text-gray-900">₹{priceData.deliveryFee.toFixed(2)}</span>
                    </div>
                  )}

                  {priceData.minimumOrder && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Min Order:</span>
                      <span className="text-gray-900">₹{priceData.minimumOrder}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center font-bold">
                      <span>Total for {item.quantity}x:</span>
                      <span className="text-lg">₹{(priceData.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={priceData.buyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block w-full text-center bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition font-semibold"
                >
                  Buy on {platform.charAt(0).toUpperCase() + platform.slice(1)}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-800">
            <p>⚠️ This item is not available on any platform at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}
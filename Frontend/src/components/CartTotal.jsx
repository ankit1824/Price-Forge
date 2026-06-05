import React, { useMemo } from 'react'

export default function CartTotal({ items, results }) {
  const platformTotals = useMemo(() => {
    if (!results || !results.items) return {}

    const totals = {}
    const platforms = ['blinkit', 'zepto', 'instamart']

    platforms.forEach(platform => {
      let total = 0
      let allItemsAvailable = true

      results.items.forEach(item => {
        const price = item.prices?.[platform]
        if (price) {
          total += price.price * item.quantity
        } else {
          allItemsAvailable = false
        }
      })

      totals[platform] = {
        total: allItemsAvailable ? total : null,
        itemsAvailable: allItemsAvailable
      }
    })

    return totals
  }, [results])

  const bestPlatform = useMemo(() => {
    let best = null
    let bestPrice = Infinity

    Object.entries(platformTotals).forEach(([platform, data]) => {
      if (data.total !== null && data.total < bestPrice) {
        bestPrice = data.total
        best = platform
      }
    })

    return best
  }, [platformTotals])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <h2 className="text-2xl font-bold mb-6">Cart Total</h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Items in cart:</p>
          <p className="text-2xl font-bold text-gray-900">{items.length} items</p>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm font-semibold text-gray-600 mb-3 uppercase">Platform Totals</p>

          {['blinkit', 'zepto', 'instamart'].map(platform => (
            <div
              key={platform}
              className={`p-3 rounded-lg mb-2 ${
                platform === bestPlatform
                  ? 'bg-green-100 border-2 border-green-500'
                  : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold capitalize">{platform}</span>
                {platformTotals[platform]?.total !== null ? (
                  <span className="text-lg font-bold">₹{platformTotals[platform]?.total.toFixed(2)}</span>
                ) : (
                  <span className="text-xs text-red-600">Not all items available</span>
                )}
              </div>
              {platform === bestPlatform && platformTotals[platform]?.total !== null && (
                <p className="text-xs text-green-700 mt-1">✓ Best deal!</p>
              )}
            </div>
          ))}
        </div>

        {bestPlatform && (
          <div className="mt-6 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white">
            <p className="text-sm mb-1">Best Overall Deal</p>
            <p className="text-2xl font-bold capitalize">{bestPlatform}</p>
            <p className="text-sm mt-2">₹{platformTotals[bestPlatform]?.total.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
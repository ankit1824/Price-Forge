import React from 'react'

export default function SearchBar({ onAddItem }) {
  const [searchTerm, setSearchTerm] = React.useState('')

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Search Items</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for grocery items"
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
        />
        <button
          onClick={() => {
            onAddItem(searchTerm)
            setSearchTerm('')
          }}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
        >
          Add
        </button>
      </div>
    </div>
  )
}

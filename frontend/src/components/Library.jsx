// src/components/Library.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useBookmarks } from '../hooks/useBookmarks.js'

export default function Library() {
  const { list, remove } = useBookmarks()

  if (list.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Your library is empty. Go bookmark some manhwas!
      </div>
    )
  }

  return (
    <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {list.map(m => (
        <div key={m.slug} className="relative group">
          <Link to={`/manhwa/${m.slug}`}>
            <img
              src={m.cover}
              alt={m.title}
              className="w-full h-auto rounded-lg shadow-lg object-cover"
            />
            <h3 className="mt-2 text-sm font-medium text-gray-100 group-hover:underline">
              {m.title}
            </h3>
          </Link>
          <button
            onClick={() => remove(m.slug)}
            className="
              absolute top-2 right-2 p-1 bg-red-600 rounded-full
              opacity-0 group-hover:opacity-100 transition
            "
            aria-label="Remove bookmark"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}

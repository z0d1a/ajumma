// src/components/Library.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { BookmarkIcon } from '@heroicons/react/24/outline'

export default function Library({ library, setLibrary }) {
  const remove = slug =>
    setLibrary(lib => lib.filter(item => item.slug !== slug))

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400 space-y-4">
      {(!Array.isArray(library) || library.length === 0) ? (
        <>
          <BookmarkIcon className="w-12 h-12 text-gray-500" />
          <p>Your library is empty. Go bookmark some manhwas!</p>
        </>
      ) : (
        <div className="max-w-5xl w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {library.map(item => (
            <div key={item.slug} className="relative group">
              <Link to={`/manhwa/${item.slug}`}>
                <img
                  src={item.cover_url}
                  alt={item.title}
                  className="w-full h-auto rounded-lg shadow-lg object-cover"
                />
                <h3 className="mt-2 text-sm font-medium text-white truncate">
                  {item.title}
                </h3>
              </Link>
              <button
                onClick={() => remove(item.slug)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove from library"
              >
                <BookmarkIcon className="w-5 h-5 text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
// src/components/Library.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { BookmarkIcon } from '@heroicons/react/24/outline'

export default function Library({ library, setLibrary }) {
  const remove = slug =>
    setLibrary(lib => lib.filter(item => item.slug !== slug))

  if (!Array.isArray(library) || library.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400 space-y-4">
        <BookmarkIcon className="w-12 h-12 text-gray-500" />
        <p>Your library is empty. Go bookmark some manhwas!</p>
      </div>
    )
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-gray-100 mb-6">Your Library</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {library.map(item => (
          <Link
            key={item.slug}
            to={`/manhwa/${item.slug}`}
            className="block h-fit"
          >
            <div className="rounded-lg bg-card text-card-foreground shadow-sm group relative overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105">
              {/* cover image */}
              <img
                src={item.cover_url}
                alt={item.title}
                className="w-full h-auto object-cover"
                loading="eager"
                decoding="async"
                style={{ color: 'transparent' }}
              />

              {/* title overlay on hover */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out will-change-opacity transform-gpu"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-sm mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* remove-from-library button */}
              <button
                onClick={e => {
                  e.preventDefault()
                  remove(item.slug)
                }}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition"
                aria-label="Remove from library"
              >
                <BookmarkIcon className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
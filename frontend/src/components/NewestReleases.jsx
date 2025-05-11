// src/components/NewestReleases.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function NewestReleases({ items }) {
  return (
    <section className="space-y-6">
      {/* Heading — no animation here */}

      {/* Grid of releases — this will fade in */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 animate-fadeIn">
        {items.map((item) => {
          // pull the `m` param out of the URL
          let slug = ''
          try {
            slug = new URL(item.link).searchParams.get('m') || ''
          } catch {}

          return (
            <Link
              key={item.link}
              to={`/manhwa/${slug}`}
              className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {/* cover image */}
              <img
                src={item.cover_url}
                alt={item.title}
                className="w-full h-40 object-cover"
              />

              {/* info */}
              <div className="p-3 text-gray-100">
                <h3 className="font-semibold text-sm line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {item.released_at}
                </p>
                <div className="mt-2 flex items-center text-xs text-gray-300">
                  <span>{item.chapters} ch</span>
                  {item.rating != null && (
                    <span className="ml-auto">
                      {item.rating.toFixed(1)}★
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
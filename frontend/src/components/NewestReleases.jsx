// src/components/NewestReleases.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function NewestReleases({ items }) {
  return (
    <section className="space-y-6">
      {/* Heading — no animation here */}

      {/* Grid of releases */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
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
              className="block h-fit"
            >
              <div className="rounded-lg bg-card text-card-foreground shadow-sm group relative overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105">
                {/* image */}
                <img
                  src={item.cover_url}
                  alt={item.title}
                  className="w-full h-auto object-cover"
                  style={{ color: 'transparent' }}
                  loading="eager"
                  decoding="async"
                />

                {/* hover overlay */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out will-change-opacity transform-gpu"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-sm mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs">
                      Chapter: {item.chapters}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

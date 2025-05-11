import React from 'react'
import { Link } from 'react-router-dom'

export default function Chapters({ slug, chapters }) {
  if (!chapters.length) return null

  return (
    <section className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Chapters</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {chapters.map((ch) => (
          <Link
            key={ch.id}
            to={`/reader?m=${encodeURIComponent(slug)}&c=${ch.id}`}
            className="block bg-gray-700 hover:bg-gray-600 rounded-lg p-4 transition-colors"
          >
            <h3 className="text-white font-medium">Chapter {ch.id}</h3>
            <p className="text-gray-400 text-sm mt-1">{ch.released_at}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
// src/components/Home.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api.js'
import HeroCarousel from './HeroCarousel.jsx'
import SpotlightCarousel from './SpotlightCarousel.jsx'
import NewestReleases from './NewestReleases.jsx'

export default function Home({ history, setHistory }) {
  const [trending, setTrending]               = useState([])
  const [popularFinished, setPopularFinished] = useState([])
  const [newest, setNewest]                   = useState([])

  useEffect(() => {
    api.get('/trending')
       .then(data => setTrending(data.results || data))
       .catch(console.error)

    api.get('/popular-finished')
       .then(data => setPopularFinished(data.results || data))
       .catch(console.error)

    api.get('/newest')
       .then(data => setNewest(data.results || data))
       .catch(console.error)
  }, [])

  // remove one history entry
  function removeFromHistory(entry) {
    setHistory(prev => {
      const arr = Array.isArray(prev) ? prev : []
      return arr.filter(
        h => !(h.slug === entry.slug && h.chap === entry.chap)
      )
    })
  }

  return (
    <div className="p-6 space-y-8">
      {/* — Continue Reading History — */}
      {history && history.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Continue Reading
          </h2>
          <div className="flex flex-wrap gap-4">
            {history.map(item => (
              <div
                key={`${item.slug}-${item.chap}`}
                className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-3 py-2 rounded shadow"
              >
                <Link
                  to={`/chapters/${item.slug}/${item.chap}`}
                  className="text-gray-700 dark:text-gray-100 hover:underline"
                >
                  {item.title} — Chap {item.chap}
                </Link>
                <button
                  onClick={() => removeFromHistory(item)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  aria-label="Remove from history"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TRENDING */}
      {trending.length > 0 && (
        <div className="flex items-center">
          <hr className="flex-grow border-gray-600" />
          <h2 className="px-4 text-lg font-semibold text-gray-100">
            TRENDING
          </h2>
          <hr className="flex-grow border-gray-600" />
        </div>
      )}
      {trending.length > 0 && <HeroCarousel items={trending} />}

      {/* POPULAR MANHWA */}
      {popularFinished.length > 0 && (
        <div className="flex items-center">
          <hr className="flex-grow border-gray-600" />
          <h2 className="px-4 text-lg font-semibold text-gray-100">
            POPULAR MANHWA
          </h2>
          <hr className="flex-grow border-gray-600" />
        </div>
      )}
      {popularFinished.length > 0 && (
        <SpotlightCarousel items={popularFinished} />
      )}

      {/* NEWEST RELEASES */}
      {newest.length > 0 && (
        <div className="flex items-center">
          <hr className="flex-grow border-gray-600" />
          <h2 className="px-4 text-lg font-semibold text-gray-100">
            NEWEST RELEASES
          </h2>
          <hr className="flex-grow border-gray-600" />
        </div>
      )}
      {newest.length > 0 && <NewestReleases items={newest} />}
    </div>
  )
}
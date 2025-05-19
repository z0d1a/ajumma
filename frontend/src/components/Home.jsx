// src/components/Home.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api.js'

import HeroCarousel      from './HeroCarousel.jsx'
import SpotlightCarousel from './SpotlightCarousel.jsx'
import NewestReleases    from './NewestReleases.jsx'

export default function Home({ history }) {
  const [trending, setTrending]               = React.useState([])
  const [popularFinished, setPopularFinished] = React.useState([])
  const [newest, setNewest]                   = React.useState([])

  React.useEffect(() => {
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


  return (
    <div className="p-6 space-y-8">
      {/* Continue Reading */}
      {Array.isArray(history) && history.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">Continue Reading</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {history.map((entry, idx) => (
              <div key={`${entry.slug}-${entry.chap}`} className="relative">
                <Link
                  to={`/chapters/${entry.slug}/${entry.chap}`}
                  className="block h-fit rounded-lg bg-gray-800 text-gray-100 shadow group p-4 hover:bg-gray-700 transition"
                >
                  <h3 className="font-medium truncate">
                    {entry.slug.replace(/-/g, ' ')}
                  </h3>
                  <p className="text-xs mt-1 opacity-75">
                    Chapter {entry.chap}
                  </p>
                </Link>
                <button
                  onClick={() =>
                    setHistory(h => h.filter((_, i) => i !== idx))
                  }
                  className="
                    absolute -top-2 -right-2
                    w-6 h-6 bg-red-600 hover:bg-red-700
                    rounded-full text-white
                    flex items-center justify-center text-xs
                    transition
                  "
                  aria-label="Remove from history"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ——— TRENDING ——— */}
      {trending.length > 0 && (
        <>
          <div className="flex items-center">
            <hr className="flex-grow border-gray-600" />
            <h2 className="px-4 text-lg font-semibold text-gray-100">TRENDING</h2>
            <hr className="flex-grow border-gray-600" />
          </div>
          <HeroCarousel items={trending} />
        </>
      )}

      {/* ——— POPULAR MANHWA ——— */}
      {popularFinished.length > 0 && (
        <>
          <div className="flex items-center">
            <hr className="flex-grow border-gray-600" />
            <h2 className="px-4 text-lg font-semibold text-gray-100">POPULAR MANHWA</h2>
            <hr className="flex-grow border-gray-600" />
          </div>
          <SpotlightCarousel items={popularFinished} />
        </>
      )}

      {/* ——— NEWEST RELEASES ——— */}
      {newest.length > 0 && (
        <>
          <div className="flex items-center">
            <hr className="flex-grow border-gray-600" />
            <h2 className="px-4 text-lg font-semibold text-gray-100">NEWEST RELEASES</h2>
            <hr className="flex-grow border-gray-600" />
          </div>
          <NewestReleases items={newest} />
        </>
      )}
    </div>
  )
}
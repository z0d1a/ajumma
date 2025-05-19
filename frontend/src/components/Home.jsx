// src/components/Home.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api.js'
import HeroCarousel      from './HeroCarousel.jsx'
import SpotlightCarousel from './SpotlightCarousel.jsx'
import NewestReleases    from './NewestReleases.jsx'

export default function Home({ history, setHistory }) {
  const navigate = useNavigate()

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

  // remove a single history entry by index
  const removeHistory = idx => {
    setHistory(h => {
      const copy = [...h]
      copy.splice(idx, 1)
      return copy
    })
  }

  return (
    <div className="p-6 space-y-8">
      {/* Continue Reading */}
      {history.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Continue Reading</h2>
          <div className="flex flex-wrap gap-4">
            {history.map((item, idx) => (
              <div
                key={`${item.slug}-${item.chapter}`}
                className="relative bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition flex items-start space-x-4"
              >
                <div>
                  <h3
                    className="text-lg capitalize cursor-pointer hover:underline"
                    onClick={() =>
                      navigate(`/chapters/${item.slug}/${item.chapter}`)
                    }
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Chapter {item.chapter}
                  </p>
                </div>
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                  onClick={() => removeHistory(idx)}
                  aria-label="Remove from history"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TRENDING */}
      {trending.length > 0 && (
        <>
          <div className="flex items-center">
            <hr className="flex-grow border-gray-600" />
            <h2 className="px-4 text-lg font-semibold text-gray-100">
              TRENDING
            </h2>
            <hr className="flex-grow border-gray-600" />
          </div>
          <HeroCarousel items={trending} />
        </>
      )}

      {/* POPULAR MANHWA */}
      {popularFinished.length > 0 && (
        <>
          <div className="flex items-center">
            <hr className="flex-grow border-gray-600" />
            <h2 className="px-4 text-lg font-semibold text-gray-100">
              POPULAR MANHWA
            </h2>
            <hr className="flex-grow border-gray-600" />
          </div>
          <SpotlightCarousel items={popularFinished} />
        </>
      )}

      {/* NEWEST RELEASES */}
      {newest.length > 0 && (
        <>
          <div className="flex items-center">
            <hr className="flex-grow border-gray-600" />
            <h2 className="px-4 text-lg font-semibold text-gray-100">
              NEWEST RELEASES
            </h2>
            <hr className="flex-grow border-gray-600" />
          </div>
          <NewestReleases items={newest} />
        </>
      )}
    </div>
  )
}
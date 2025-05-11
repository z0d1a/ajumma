// src/components/Home.jsx
import React, { useState, useEffect } from 'react'
import { api } from '../services/api.js'
import HeroCarousel from './HeroCarousel.jsx'
import SpotlightCarousel from './SpotlightCarousel.jsx'
import NewestReleases from './NewestReleases.jsx'

export default function Home() {
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

  return (
    <div className="p-6 space-y-8">
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
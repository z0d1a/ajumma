// src/components/HeroCarousel.jsx
import React, { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'

export default function HeroCarousel({ items }) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState(null)
  const total = items.length

  // Fade duration must match CSS transition
  const FADE_MS = 600

  // Advance with crossfade
  const advanceTo = (nextIdx) => {
    if (nextIdx === current) return
    setPrev(current)
    setCurrent(nextIdx)

    // after fade duration, drop the prev layer
    setTimeout(() => {
      setPrev(null)
    }, FADE_MS)
  }

  const prevSlide = () => advanceTo((current + total - 1) % total)
  const nextSlide = () => advanceTo((current + 1) % total)

  // autoplay
  useEffect(() => {
    const t = setInterval(nextSlide, 5000)
    return () => clearInterval(t)
  }, [current, total])

  // extract slug
  const link = items[current]?.link || ''
  const slug = React.useMemo(() => {
    try {
      return new URLSearchParams(link.split('?')[1]).get('m')
    } catch {
      return ''
    }
  }, [link])

  const renderLayer = (idx, visible) => {
    const item = items[idx]
    if (!item) return null
    const { cover_url, title, rating = 0, description = '' } = item
    return (
      <div
        className={`
          absolute inset-0 flex flex-col justify-center transition-opacity duration-${FADE_MS} ease-out
          ${visible ? 'opacity-100' : 'opacity-0'}
        `}
      >
        {/* blurred background */}
        <div
          className="absolute inset-0 bg-center bg-cover filter blur-xl grayscale opacity-40"
          style={{ backgroundImage: `url(${cover_url})` }}
        />
        <div className="relative h-full flex items-center justify-center">
          <img
            src={cover_url}
            alt={title}
            className="max-w-full max-h-full object-cover rounded-lg shadow-xl transform transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <h2 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg mb-2">{title}</h2>
          {rating > 0 && (
            <div className="flex items-center text-yellow-300 drop-shadow mb-2">
              <StarIcon className="w-6 h-6 mr-1" />
              <span className="text-xl">{rating.toFixed(1)}</span>
            </div>
          )}
          {description && (
            <p className="text-white leading-relaxed drop-shadow mb-4 max-w-2xl">{description}</p>
          )}
          <Link
            to={`/chapters/${slug}/1`}
            className="inline-block text-white underline hover:text-gray-200 transition"
          >
            Start at Chapter 1 →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-80 md:h-96 overflow-hidden rounded-lg">
      {/* Previous layer (fading out) */}
      {prev !== null && renderLayer(prev, false)}
      {/* Current layer (fading in) */}
      {renderLayer(current, true)}

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition z-10"
        aria-label="Previous"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition z-10"
        aria-label="Next"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>
    </div>
  )
}
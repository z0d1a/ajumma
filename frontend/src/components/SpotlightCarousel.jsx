// src/components/SpotlightCarousel.jsx
import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'

export default function SpotlightCarousel({ items }) {
  const [current, setCurrent] = useState(0)
  const total = items.length
  const slideRefs = useRef([])

  const prev = () => setCurrent(c => (c + total - 1) % total)
  const next = () => setCurrent(c => (c + 1) % total)

  // autoplay every 3s
  useEffect(() => {
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [total])

  return (
    <div className="mx-auto space-y-4 shadow-lg">
      <div className="relative">
        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 z-10"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-75 z-10"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>

        {/* slides viewport */}
        <div
          className="
            embla__viewport
            overflow-x-auto overflow-y-hidden
            flex items-center snap-x snap-mandatory
            space-x-4 px-screen
          "
        >
          {items.map((item, idx) => {
            const isCurrent = idx === current
            let slug = ''
            try {
              slug = new URL(item.link).searchParams.get('m') || ''
            } catch {}
            return (
              <div
                key={item.link}
                ref={el => (slideRefs.current[idx] = el)}
                data-current={isCurrent}
                className={`
                  embla__slide
                  flex-shrink-0
                  w-[200px] h-[200px] lg:w-[280px] lg:h-[280px]
                  rounded-2xl shadow
                  snap-align-center
                  transition-opacity duration-300
                  ${isCurrent
                    ? 'opacity-100 saturate-100'
                    : 'opacity-30 saturate-0'}
                `}
                onClick={() => setCurrent(idx)}
              >
                <Link to={`/manhwa/${slug}`} className="block w-full h-full z-10">
                  <div className="relative w-full h-full overflow-hidden rounded-2xl">
                    <img
                      src={item.cover_url}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover object-[100%_10%] opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50" />
                    <div
                      style={{ textShadow: '0 0 5px rgba(0,0,0,0.7)' }}
                      className={`
                        absolute bottom-3 left-0 right-0 z-20 px-4 text-white
                        transition-opacity duration-300
                        ${isCurrent ? 'opacity-100' : 'opacity-0'}
                      `}
                    >
                      <h5 className="font-semibold text-xxs lg:text-sm">
                        {item.title}
                      </h5>
                      <p className="mt-1 text-[8px] lg:text-xxs line-clamp-3">
                        {item.description || 'No description available.'}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
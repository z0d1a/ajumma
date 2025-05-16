// src/components/Reader.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api.js'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/solid'

export default function Reader() {
  const { slug, chap } = useParams()
  const navigate = useNavigate()
  const chapter = parseInt(chap, 10)

  const [pages, setPages]           = useState([])
  const [totalChapters, setTotal]   = useState(0)
  const [detail, setDetail]         = useState(null)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)

  // zoom state (0.5–2.0)
  const [zoom, setZoom] = useState(1)
  const zoomIn  = () => setZoom(z => Math.min(2, z + 0.1))
  const zoomOut = () => setZoom(z => Math.max(0.5, z - 0.1))

  // fetch pages for this chapter
  useEffect(() => {
    if (!slug || !chapter) return
    setLoading(true)
    setError(null)

    api.get(`/page?m=${encodeURIComponent(slug)}&c=${chapter}`)
      .then(res => {
        const arr = Array.isArray(res.data) ? res.data : res
        setPages(arr)
      })
      .catch(() => setError('Failed to load pages.'))
      .finally(() => setLoading(false))
  }, [slug, chapter])

  // fetch series detail (title + totalChapters)
  useEffect(() => {
    if (!slug) return

    api.get(`?m=${encodeURIComponent(slug)}`)
      .then(res => {
        const d = res.data ?? res
        setTotal(d.chapters)
        setDetail(d)
      })
      .catch(() => {
        // swallow: we’ll still show pages even if detail fails
      })
  }, [slug])

  // navigation helpers
  const prevChap = chapter > 1 ? chapter - 1 : null
  const nextChap = chapter + 1

  // loading / error states
  if (loading) {
    return (
      <div className="flex flex-col items-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">Loading chapter…</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to={`/manhwa/${slug}`} className="text-blue-500 hover:underline">
          ← Back to Details
        </Link>
      </div>
    )
  }

  return (
    // negative top margin to pull reader right under navbar
    <main
      className="
        -mt-8 
        group relative
        bg-gray-100 dark:bg-gray-900
        flex-1 flex flex-col
        md:border-t md:rounded-tl-xl md:border-l
        md:overflow-y-auto
        scrollbar-hide
      "
      style={{ scrollbarGutter: 'auto' }}
    >
      {/* image scroll area */}
      <div className="flex-grow overflow-x-hidden">
        <div
          id="reader"
          className="flex flex-col items-center bg-transparent overflow-auto space-y-8 px-4 py-4"
        >
          {pages.map((p, i) => (
            <img
              key={i}
              src={p.url}
              alt={`Page ${i + 1}`}
              loading="eager"
              className="object-contain w-full max-w-2xl"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
              }}
            />
          ))}
        </div>
      </div>

      {/* sticky footer (mini controls) */}
      <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-700 px-4 py-3">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Title + mobile select */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <h2 className="text-lg font-semibold">
              <Link to={`/manhwa/${slug}`} className="hover:underline">
                {detail?.title || slug.replace(/-/g, ' ')}
              </Link>
            </h2>
            <select
              value={chapter}
              onChange={e => navigate(`/chapters/${slug}/${e.target.value}`)}
              className="block mt-2 mb-2 w-full sm:hidden bg-gray-200 dark:bg-gray-800 rounded px-3 py-2 text-sm"
              aria-label="Select chapter"
            >
              {Array.from({ length: totalChapters }, (_, i) => i + 1)
                .reverse()
                .map(cnum => (
                  <option key={cnum} value={cnum}>
                    Chapter {cnum}
                  </option>
                ))}
            </select>
          </div>

          {/* bookmark / toggle */}
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition">
              Toggle Reader
            </button>
            <button className="px-4 py-2 border rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition">
              Bookmark
            </button>
          </div>

          {/* prev / next chapter */}
          <div className="flex items-center gap-4">
            {prevChap && (
              <Link
                to={`/chapters/${slug}/${prevChap}`}
                className="flex items-center px-4 py-2 border rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                <ChevronLeftIcon className="w-4 h-4 mr-1" /> Previous
              </Link>
            )}
            <Link
              to={`/chapters/${slug}/${nextChap}`}
              className="flex items-center px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Next <ChevronRightIcon className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* zoom controls */}
      <div className="fixed bottom-4 left-4 flex items-center bg-gray-800 bg-opacity-75 rounded-lg overflow-hidden z-50">
        <button
          onClick={zoomOut}
          className="px-3 py-2 hover:bg-gray-700 transition"
          aria-label="Zoom out"
        >
          –
        </button>
        <div className="px-3 py-2 text-sm text-gray-100">
          {Math.round(zoom * 100)}%
        </div>
        <button
          onClick={zoomIn}
          className="px-3 py-2 hover:bg-gray-700 transition"
          aria-label="Zoom in"
        >
          +
        </button>
      </div>
    </main>
  )
}
// src/components/Reader.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api.js'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

export default function Reader() {
  const { slug, chap } = useParams()
  const navigate = useNavigate()
  const chapter = parseInt(chap, 10)

  const [pages, setPages]         = useState([])
  const [totalChapters, setTotal] = useState(0)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  // zoom state (0.5–2.0)
  const [zoom, setZoom] = useState(1)
  const zoomIn  = () => setZoom(z => Math.min(2, z + 0.1))
  const zoomOut = () => setZoom(z => Math.max(0.5, z - 0.1))

  // fetch pages
  useEffect(() => {
    if (!slug || !chapter) return
    setLoading(true)
    setError(null)
    api.get(`/page?m=${encodeURIComponent(slug)}&c=${chapter}`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res
        setPages(data)
      })
      .catch(() => setError('Failed to load pages.'))
      .finally(() => setLoading(false))
  }, [slug, chapter])

  // fetch totalChapters
  useEffect(() => {
    if (!slug) return
    api.get(`?m=${encodeURIComponent(slug)}`)
      .then(res => {
        const detail = res.data ?? res
        setTotal(detail.chapters)
      })
      .catch(() => {})
  }, [slug])

  if (loading) {
    return (
      <div className="flex flex-col items-center py-20 space-y-4">
        <div
          className="
            w-10 h-10
            border-4 border-gray-300 dark:border-gray-600
            border-t-transparent
            rounded-full
            animate-spin
          "
        />
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

  const prevChap = chapter > 1 ? chapter - 1 : null
  const nextChap = chapter + 1

  return (
    <div className="px-4 py-8">
      {/* navigation bar */}
      <div className="flex items-center space-x-4 mb-4">
        <Link
          to={`/manhwa/${slug}`}
          className="flex items-center text-gray-300 hover:underline"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" /> Back to Details
        </Link>

        {prevChap && (
          <button
            onClick={() => navigate(`/chapters/${slug}/${prevChap}`)}
            className="p-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-200" />
          </button>
        )}

        <select
          value={chapter}
          onChange={e => navigate(`/chapters/${slug}/${e.target.value}`)}
          className="flex-1 bg-gray-800 text-white rounded px-3 py-1"
        >
          {Array.from({ length: totalChapters }, (_, i) => i + 1).map(cnum => (
            <option key={cnum} value={cnum}>
              Chapter {cnum}
            </option>
          ))}
        </select>

        <button
          onClick={() => navigate(`/chapters/${slug}/${nextChap}`)}
          className="p-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-200" />
        </button>
      </div>

      {/* pages: no vertical gaps */}
      <div>
        {pages.map((p, i) => (
          <img
            key={i}
            src={p.url}
            alt={`Panel ${i + 1}`}
            className="block mx-auto rounded-lg shadow-md"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
            }}
          />
        ))}
      </div>

      {/* zoom controls — fixed bottom-left */}
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
    </div>
  )
}
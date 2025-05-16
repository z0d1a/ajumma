// src/components/Reader.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api.js'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

export default function Reader() {
  const { slug, chap } = useParams()
  const navigate       = useNavigate()
  const chapter        = parseFloat(chap)

  // state
  const [pages, setPages]           = useState([])
  const [detail, setDetail]         = useState(null)
  const [totalChapters, setTotal]   = useState(0)
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [zoom, setZoom]             = useState(1)
  const [footerVisible, setFooterVisible] = useState(false)

  // zoom handlers
  const zoomIn  = () => setZoom(z => Math.min(2, +(z + 0.1).toFixed(1)))
  const zoomOut = () => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(1)))

  // fetch pages
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

  // fetch detail
  useEffect(() => {
    if (!slug) return
    api.get(`?m=${encodeURIComponent(slug)}`)
      .then(res => {
        const d = res.data ?? res
        setDetail(d)
        setTotal(d.chapters)
      })
      .catch(() => {/* ignore detail failure */})
  }, [slug])

  // chapter navigation
  const prevChap = chapter > 1 ? chapter - 1 : null
  const nextChap = chapter + 1

  // loading / error
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin"/>
        <p className="mt-4 text-gray-500">Loading chapter…</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to={`/manhwa/${slug}`} className="text-blue-500 hover:underline">
          ← Back to Details
        </Link>
      </div>
    )
  }

  return (
    <div
      className="flex-1 flex flex-col bg-gray-900 text-gray-100 relative"
      onClick={() => setFooterVisible(vis => !vis)}
    >
      {/* Scrollable pages */}
      <div className="flex-1 overflow-auto scrollbar-hide">
        <div className="flex justify-center py-10">
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden"
            style={{ width: '100%', maxWidth: 800 }}
          >
            <div
              id="reader"
              className="overflow-auto"
              style={{ maxHeight: 'calc(100vh - 160px)' }}
            >
              {pages.map((p,i) => (
                <img
                  key={i}
                  src={p.url}
                  alt={`Page ${i+1}`}
                  loading="eager"
                  className="w-full object-contain"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease-out',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center space-x-2 bg-gray-800 bg-opacity-80 rounded-lg p-1">
        <button
          onClick={zoomOut}
          className="px-3 py-1 text-2xl hover:bg-gray-700 rounded transition"
          aria-label="Zoom out"
        >–</button>
        <span className="text-sm w-12 text-center">{Math.round(zoom*100)}%</span>
        <button
          onClick={zoomIn}
          className="px-3 py-1 text-2xl hover:bg-gray-700 rounded transition"
          aria-label="Zoom in"
        >+</button>
      </div>

      {/* Footer (click to toggle) */}
      {footerVisible && (
        <footer className="fixed bottom-0 inset-x-0 bg-gray-800 bg-opacity-95 border-t border-gray-700 text-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
            {/* Title & desktop dropdown */}
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <Link
                to={`/manhwa/${slug}`}
                className="font-bold hover:underline"
              >
                {detail?.title || slug.replace(/-/g,' ')}
              </Link>
              <select
                value={chapter}
                onChange={e => navigate(`/chapters/${slug}/${e.target.value}`)}
                className="hidden md:block bg-gray-700 text-sm rounded border border-gray-600 px-3 py-1"
              >
                {Array.from({length: totalChapters},(_,i)=>i+1)
                  .map(num => (
                    <option key={num} value={num}>
                      Chapter {num}
                    </option>
                  ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border rounded bg-gray-700 hover:bg-gray-600 transition">
                Toggle Reader
              </button>
              <button className="px-4 py-2 border rounded bg-gray-700 hover:bg-gray-600 transition">
                Bookmark
              </button>
            </div>

            {/* Prev / Next */}
            <div className="flex items-center space-x-3">
              {prevChap && (
                <Link
                  to={`/chapters/${slug}/${prevChap}`}
                  className="flex items-center px-4 py-2 border rounded hover:bg-gray-700 transition"
                >
                  <ChevronLeftIcon className="w-4 h-4 mr-1"/>
                  Prev
                </Link>
              )}
              <Link
                to={`/chapters/${slug}/${nextChap}`}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Next
                <ChevronRightIcon className="w-4 h-4 ml-1"/>
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

// src/components/Reader.jsx
import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../services/api.js'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowsPointingOutIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline'

export default function Reader({ history, setHistory }) {
  const { slug, chap } = useParams()
  const navigate       = useNavigate()
  const chapter        = parseFloat(chap)

  // state
  const [pages, setPages]             = useState([])
  const [detail, setDetail]           = useState(null)
  const [totalChapters, setTotal]     = useState(0)
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [zoom, setZoom]               = useState(1)
  const [footerVisible, setFooterVisible] = useState(false)

  // zoom
  const zoomIn  = () => setZoom(z => Math.min(2, +(z + 0.1).toFixed(1)))
  const zoomOut = () => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(1)))

  // fetch pages
  useEffect(() => {
    if (!slug || !chapter) return
    setLoading(true)
    api.get(`/page?m=${encodeURIComponent(slug)}&c=${chapter}`)
      .then(res => setPages(Array.isArray(res.data) ? res.data : res))
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
      .catch(() => {})
  }, [slug])

  // record history entry once chapter loads
  useEffect(() => {
    if (!loading && !error && detail) {
      setHistory({ slug, chap: chapter, title: detail.title })
    }
    // only run when loading changes to false or slug/chap/detail change
  }, [loading, error, slug, chapter, detail, setHistory])

  const prevChap = chapter > 1 ? chapter - 1 : null
  const nextChap = chapter + 1

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-transparent rounded-full animate-spin"/>
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading…</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center px-4">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900 text-gray-100">

      {/* only this div toggles footer */}
      <div
        className="flex-1 overflow-auto scrollbar-hide"
        onClick={() => setFooterVisible(vis => !vis)}
      >
        <div className="flex justify-center py-12 px-4">
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
            style={{ maxWidth: 550, width: '100%' }}
          >
            <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
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
                    transition: 'transform 0.2s',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* zoom controls */}
      <div className="fixed bottom-3 left-6 z-50 flex items-center space-x-2 bg-gray-800 bg-opacity-80 rounded-lg p-1">
        <button
          onClick={zoomOut}
          className="p-2 hover:bg-gray-700 rounded transition"
          aria-label="Zoom out"
        >–</button>
        <span className="w-12 text-center text-sm">{Math.round(zoom*100)}%</span>
        <button
          onClick={zoomIn}
          className="p-2 hover:bg-gray-700 rounded transition"
          aria-label="Zoom in"
        >+</button>
      </div>

      {/* footer */}
      {footerVisible && (
        <footer
          className="
            fixed bottom-0 inset-x-0
            bg-white/10 backdrop-blur-sm
            dark:bg-gray-900/80
            border-t border-gray-700
            text-gray-100
            z-40
          "
          onClick={e => e.stopPropagation()}
        >
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-3 space-y-3 md:space-y-0">

            {/* title + dropdown */}
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <Link
                to={`/manhwa/${slug}`}
                className="text-lg font-semibold hover:underline"
              >
                {detail?.title || slug.replace(/-/g,' ')}
              </Link>
              <select
                value={chapter}
                onChange={e => navigate(`/chapters/${slug}/${e.target.value}`)}
                className="bg-gray-700 text-sm rounded border border-gray-600 px-3 py-1"
              >
                {Array.from({length: totalChapters},(_,i)=>i+1)
                  .map(num => (
                    <option key={num} value={num}>
                      Chapter {num}
                    </option>
                  ))
                }
              </select>
            </div>

            {/* toggle & bookmark */}
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
                <ArrowsPointingOutIcon className="w-5 h-5"/>
                <span>Toggle</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition">
                <BookmarkIcon className="w-5 h-5"/>
                <span>Bookmark</span>
              </button>
            </div>

            {/* prev / next */}
            <div className="flex items-center space-x-3">
              {prevChap && (
                <Link
                  to={`/chapters/${slug}/${prevChap}`}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition"
                >
                  <ChevronLeftIcon className="w-5 h-5"/>
                  <span>Prev</span>
                </Link>
              )}
              <Link
                to={`/chapters/${slug}/${nextChap}`}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                <span>Next</span>
                <ChevronRightIcon className="w-5 h-5"/>
              </Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
// src/components/Details.jsx
import { Fragment, useEffect, useState } from 'react'
import { useParams, Link }           from 'react-router-dom'
import { Tab }                       from '@headlessui/react'
import { StarIcon }                  from '@heroicons/react/24/solid'
import { BookmarkIcon as BookmarkEmptyIcon } from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'
import { api }                       from '../services/api.js'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Details({ library, setLibrary }) {
  const { slug } = useParams()
  const [detail, setDetail]     = useState(null)
  const [chapters, setChapters] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  // fetch metadata & chapter list
  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      api.get(`?m=${encodeURIComponent(slug)}`),
      api.get(`/chapters?m=${encodeURIComponent(slug)}`)
    ])
      .then(([dRes, cRes]) => {
        const d = dRes.data ?? dRes
        setDetail(d)
        setChapters(cRes.data ?? cRes)
      })
      .catch(() => setError('Failed to load manhwa data.'))
      .finally(() => setLoading(false))
  }, [slug])

  // library toggle
  const inLibrary =
    Array.isArray(library) && library.some(item => item.slug === slug)

  function toggleLibrary() {
    if (!detail) return

    if (inLibrary) {
      setLibrary(lib => lib.filter(item => item.slug !== slug))
    } else {
      setLibrary(lib => [
        ...(lib || []),
        {
          slug,
          title: detail.title || slug.replace(/-/g, ' '),
          cover_url: detail.cover_url || ''
        }
      ])
    }
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-gray-300 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>
  }

  // guard if somehow detail is still null
  if (!detail) {
    return <p className="text-center text-gray-400">No detail to show.</p>
  }

  // ensure genres is always an array
  const genres = Array.isArray(detail.genres) ? detail.genres : []

  return (
    <div className="relative">
      {/* blurred backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-xl scale-105"
        style={{ backgroundImage: `url(${detail.cover_url || ''})` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative max-w-5xl mx-auto px-4 py-12 text-white space-y-8">
        {/* back & library button */}
        <div className="flex items-center justify-between">
          <Link to="/" className="text-gray-300 hover:text-white">
            &larr; Back to Home
          </Link>
          <button
            onClick={toggleLibrary}
            aria-label={inLibrary ? 'Remove from Library' : 'Add to Library'}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
          >
            {inLibrary ? (
              <BookmarkSolidIcon className="w-6 h-6 text-yellow-300" />
            ) : (
              <BookmarkEmptyIcon className="w-6 h-6 text-gray-200" />
            )}
          </button>
        </div>

        {/* cover + info */}
        <div className="md:flex md:space-x-8 items-start">
          <img
            src={detail.cover_url}
            alt={detail.title}
            className="w-48 md:w-64 rounded-lg shadow-2xl ring-4 ring-black/70"
          />
          <div className="mt-6 md:mt-0 flex-1 space-y-4">
            <h1 className="text-4xl font-bold">{detail.title}</h1>
            <div className="flex items-center space-x-2">
              <StarIcon className="w-6 h-6 text-yellow-400" />
              <span className="text-lg">
                {typeof detail.rating === 'number'
                  ? detail.rating.toFixed(1)
                  : '—'}
              </span>
            </div>
            {detail.updated_at && (
              <p className="italic text-gray-300">{detail.updated_at}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {detail.status && (
                <span className="px-2 py-1 bg-indigo-600 rounded text-xs">
                  {detail.status.toUpperCase()}
                </span>
              )}
              {genres.map((g, i) => (
                <span key={i} className="px-2 py-1 bg-gray-700 rounded text-xs">
                  {g}
                </span>
              ))}
            </div>
            <p className="text-gray-200 leading-relaxed">
              {detail.description || 'No description available.'}
            </p>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-300">
              <dt className="font-medium">Release year</dt>
              <dd>{detail.release_year ?? '—'}</dd>
              <dt className="font-medium">Views</dt>
              <dd>{detail.views ?? '—'}</dd>
              <dt className="font-medium">Author</dt>
              <dd>{detail.author ?? '—'}</dd>
              <dt className="font-medium">Chapters</dt>
              <dd>{detail.chapters ?? '—'}</dd>
              <dt className="font-medium">Bookmarks</dt>
              <dd>{detail.bookmarks ?? 0}</dd>
            </dl>
          </div>
        </div>

        {/* tabs */}
        <Tab.Group>
          <Tab.List className="flex space-x-4 border-b border-gray-600">
            {['Chapters', 'Notices'].map(label => (
              <Tab
                key={label}
                className={({ selected }) =>
                  classNames(
                    'py-2 px-4 -mb-px cursor-pointer',
                    selected
                      ? 'border-b-2 border-red-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  )
                }
              >
                {label}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-6">
            {/* chapters list */}
            <Tab.Panel>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {chapters.map(ch => (
                  <Link
                    key={ch.id}
                    to={`/chapters/${slug}/${ch.id}`}
                    className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                  >
                    <h3 className="text-md font-medium">{ch.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {ch.released_at}
                    </p>
                  </Link>
                ))}
              </div>
            </Tab.Panel>

            {/* notices */}
            <Tab.Panel>
              <p className="text-gray-300">No notices at this time.</p>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}
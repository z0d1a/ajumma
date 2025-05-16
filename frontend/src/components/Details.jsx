import { Fragment, useEffect, useState } from 'react'
import { useParams, Link }           from 'react-router-dom'
import { Tab }                       from '@headlessui/react'
import { StarIcon }                  from '@heroicons/react/24/solid'
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

  // fetch manhwa metadata + chapters
  useEffect(() => {
    setLoading(true)
    Promise.all([
      api.get(`?m=${encodeURIComponent(slug)}`),
      api.get(`/chapters?m=${encodeURIComponent(slug)}`)
    ])
      .then(([dRes, cRes]) => {
        setDetail(dRes.data ?? dRes)
        setChapters(cRes.data ?? cRes)
      })
      .catch(() => setError('Failed to load manhwa data.'))
      .finally(() => setLoading(false))
  }, [slug])

  // determine if current slug is in library
  const inLibrary = library.some(item => item.slug === slug)
  const toggleLibrary = () => {
    if (!detail) return
    if (inLibrary) {
      setLibrary(lib => lib.filter(item => item.slug !== slug))
    } else {
      setLibrary(lib => [
        ...lib,
        {
          slug,
          title: detail.title,
          cover_url: detail.cover_url
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

  return (
    <div className="relative">
      {/* Blurred, darkened backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-xl scale-105"
        style={{ backgroundImage: `url(${detail.cover_url})` }}
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative max-w-5xl mx-auto px-4 py-12 text-white space-y-8">
        {/* Back + Library toggle */}
        <div className="flex items-center justify-between">
          <Link to="/" className="text-gray-300 hover:text-white">
            &larr; Back to Home
          </Link>
          <button
            onClick={toggleLibrary}
            className={classNames(
              'px-4 py-2 rounded font-medium transition',
              inLibrary
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            )}
          >
            {inLibrary ? 'Remove from Library' : 'Add to Library'}
          </button>
        </div>

        {/* Cover + Info */}
        <div className="md:flex md:space-x-8 items-start">
          <div className="flex-shrink-0">
            <img
              src={detail.cover_url}
              alt={detail.title}
              className="w-48 md:w-64 rounded-lg shadow-2xl ring-4 ring-black/70"
            />
          </div>
          <div className="mt-6 md:mt-0 flex-1 space-y-4">
            <h1 className="text-4xl font-bold">{detail.title}</h1>
            <div className="flex items-center space-x-2">
              <StarIcon className="w-6 h-6 text-yellow-400" />
              <span className="text-lg">{detail.rating.toFixed(1)}</span>
            </div>
            {detail.updated_at && (
              <p className="italic text-gray-300">{detail.updated_at}</p>
            )}
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-green-600 rounded text-xs">ONGOING</span>
              {detail.genres.map((g,i) => (
                <span key={i} className="px-2 py-1 bg-gray-700 rounded text-xs">
                  {g}
                </span>
              ))}
            </div>
            <p className="text-gray-200 leading-relaxed">
              {detail.description
                ? detail.description
                : 'Details for this Manhwa are coming soon!'}
            </p>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm text-gray-300">
              <dt className="font-medium">Release year</dt>
              <dd>{detail.release_year ?? '—'}</dd>
              <dt className="font-medium">Total views</dt>
              <dd>{detail.views ?? '—'}</dd>
              <dt className="font-medium">Author</dt>
              <dd>{detail.author ?? '—'}</dd>
              <dt className="font-medium">Chapters</dt>
              <dd>{detail.chapters}</dd>
              <dt className="font-medium">Bookmarks</dt>
              <dd>{detail.bookmarks ?? 0}</dd>
            </dl>
          </div>
        </div>

        {/* Chapter List / Notices Tabs */}
        <Tab.Group>
          <Tab.List className="flex space-x-4 border-b border-gray-600">
            {['Chapters list','Notices'].map(tab => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    'py-2 px-4 -mb-px',
                    selected
                      ? 'border-b-2 border-red-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  )
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="mt-6">
            <Tab.Panel>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {chapters.map(ch => (
                  <Link
                    key={ch.id}
                    to={`/chapters/${slug}/${ch.id}`}
                    className="block p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                  >
                    <h3 className="text-md font-medium">{ch.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{ch.released_at}</p>
                  </Link>
                ))}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <p className="text-gray-300">No notices yet.</p>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  )
}

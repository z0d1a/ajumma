import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MoonIcon,
  SunIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  BookmarkIcon,
} from '@heroicons/react/24/solid'

export default function Navbar({ darkMode, toggleDarkMode }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const openSearch = () => {
    setSearchOpen(true)
    setTimeout(() => document.getElementById('spotlight-input')?.focus(), 100)
  }
  const closeSearch = () => setSearchOpen(false)

  const onSubmit = e => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      closeSearch()
    }
  }

  return (
    <>
      <nav className="relative bg-gray-900 px-4 py-3 flex items-center justify-center">
        {/* search icon on left */}
        <button
          onClick={openSearch}
          className="absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-full hover:bg-gray-800 transition"
          aria-label="Search"
        >
          <MagnifyingGlassIcon className="w-6 h-6 text-gray-200" />
        </button>

        {/* centered logo */}
        <Link to="/" className="text-2xl font-bold text-white">
          ajumma.
        </Link>

        {/* library icon next to dark toggle */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 flex space-x-2">
          <Link to="/library" aria-label="Library">
            <BookmarkIcon className="w-6 h-6 text-gray-200 hover:text-white transition" />
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-800 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode
              ? <SunIcon className="w-6 h-6 text-gray-200" />
              : <MoonIcon className="w-6 h-6 text-gray-200" />}
          </button>
        </div>
      </nav>

      {/* Spotlight search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn"
          onClick={closeSearch}
        >
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={onSubmit}
            className="relative w-full max-w-lg mx-4"
          >
            <input
              id="spotlight-input"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search manhwa..."
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            <button
              type="button"
              onClick={closeSearch}
              className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-700 transition"
              aria-label="Close search"
            >
              <XMarkIcon className="w-6 h-6 text-gray-200" />
            </button>
          </form>
        </div>
      )}
    </>
  )
}

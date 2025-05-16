import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Navbar      from './components/Navbar.jsx'
import Home        from './components/Home.jsx'
import SearchPage  from './components/SearchPage.jsx'
import Details     from './components/Details.jsx'
import Reader      from './components/Reader.jsx'
import Library     from './components/Library.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

export default function App() {
  // ——— Dark mode (persisted to localStorage) ———
  const [dark, setDark] = useState(
    () =>
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.theme = dark ? 'dark' : 'light'
  }, [dark])

  // ——— Library / bookmarks (persisted to localStorage) ———
  const [library, setLibrary] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('library')) || []
    } catch {
      return []
    }
  })
  useEffect(() => {
    localStorage.setItem('library', JSON.stringify(library))
  }, [library])

  return (
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
        {/* pass dark-mode controls + library count into Navbar */}
        <Navbar
          darkMode={dark}
          toggleDarkMode={() => setDark(d => !d)}
          libraryCount={library.length}
        />

        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Search */}
            <Route path="/search" element={<SearchPage />} />

            {/* Details (needs library & setter) */}
            <Route
              path="/manhwa/:slug"
              element={
                <Details
                  library={library}
                  setLibrary={setLibrary}
                />
              }
            />

            {/* Reader */}
            <Route
              path="/chapters/:slug/:chap"
              element={<Reader />}
            />

            {/* Library */}
            <Route
              path="/library"
              element={
                <Library
                  library={library}
                  setLibrary={setLibrary}
                />
              }
            />

            {/* Catch-all → home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <ScrollToTop />
      </div>
  )
}

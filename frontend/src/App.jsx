import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar      from './components/Navbar.jsx'
import Home        from './components/Home.jsx'
import SearchPage  from './components/SearchPage.jsx'
import Details     from './components/Details.jsx'
import Reader      from './components/Reader.jsx'
import Library     from './components/Library.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

export default function App() {
  // ——— Dark mode setup ———
  const [dark, setDark] = useState(
    () => localStorage.theme === 'dark'
      || (!('theme' in localStorage)
          && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.theme = dark ? 'dark' : 'light'
  }, [dark])

  // ——— Library state (persisted in localStorage) ———
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* pass dark mode controls down to Navbar */}
      <Navbar darkMode={dark} toggleDarkMode={() => setDark(d => !d)} />

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchPage />} />
          {/* inject library + setter into Details */}
          <Route
            path="/manhwa/:slug"
            element={
              <Details
                library={library}
                setLibrary={setLibrary}
              />
            }
          />
          <Route path="/chapters/:slug/:chap" element={<Reader />} />

          {/* new library route */}
          <Route
            path="/library"
            element={<Library />}
          />
        </Routes>
      </main>

      <ScrollToTop />
    </div>
  )
}

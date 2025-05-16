// src/App.jsx
import React, { useEffect, useState } from 'react'
import { Routes, Route }               from 'react-router-dom'
import Navbar                          from './components/Navbar.jsx'
import Home                            from './components/Home.jsx'
import SearchPage                      from './components/SearchPage.jsx'
import Details                         from './components/Details.jsx'
import Reader                          from './components/Reader.jsx'
import Library                         from './components/Library.jsx'
import ScrollToTop                     from './components/ScrollToTop.jsx'

export default function App() {
  // — Dark mode setup —
  const [dark, setDark] = useState(() => {
    if (localStorage.theme === 'dark') return true
    if (localStorage.theme === 'light') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.theme = dark ? 'dark' : 'light'
  }, [dark])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar darkMode={dark} toggleDarkMode={() => setDark(d => !d)} />

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/"                  element={<Home />} />
          <Route path="/search"            element={<SearchPage />} />
          <Route path="/library"           element={<Library />} />
          <Route path="/manhwa/:slug"      element={<Details />} />
          <Route path="/chapters/:slug/:chap" element={<Reader />} />
        </Routes>
      </main>

      <ScrollToTop />
    </div>
  )
}

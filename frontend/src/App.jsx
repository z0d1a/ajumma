// src/App.jsx
import React from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import { useBookmarks } from './hooks/useBookmarks.js'

import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import Details from './components/Details.jsx'
import Reader from './components/Reader.jsx'
import Library from './components/Library.jsx'

export default function App() {
  // useBookmarks returns { bookmarks, addBookmark, removeBookmark }
  const {
    bookmarks: library,
    addBookmark,
    removeBookmark,
  } = useBookmarks()

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen">
        {/* pass the current library size so Navbar can render a badge */}
        <Navbar libraryCount={library.length} />

        {/* main content area */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* details needs library + add/remove */}
            <Route
              path="/manhwa/:slug"
              element={
                <Details
                  library={library}
                  addBookmark={addBookmark}
                  removeBookmark={removeBookmark}
                />
              }
            />

            {/* chapter reader stays the same */}
            <Route
              path="/chapters/:slug/:chap"
              element={<Reader />}
            />

            {/* library page */}
            <Route
              path="/library"
              element={
                <Library
                  library={library}
                  removeBookmark={removeBookmark}
                />
              }
            />

            {/* any unknown URL -> home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

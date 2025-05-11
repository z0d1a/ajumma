// src/components/SearchBar.jsx
import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function SearchBar() {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const initial = params.get('q') || ''

  const [q, setQ] = useState(initial)

  const onSubmit = e => {
    e.preventDefault()
    if (q.trim().length) navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center">
      <input
        type="text"
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="Search manhwa…"
        className="px-3 py-1 rounded-l bg-gray-200 dark:bg-gray-800 focus:outline-none"
      />
      <button
        type="submit"
        className="px-3 py-1 rounded-r bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Search
      </button>
    </form>
  )
}
// src/components/SearchPage.jsx
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../services/api.js'
import Section from './Section.jsx'

export default function SearchPage() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const q = params.get('q') || ''

  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) return
    setLoading(true)
    api
      .get(`/search?t=${encodeURIComponent(q)}`)
      .then(({ total, results }) => {
        setTotal(total)
        setResults(results)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [q])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12" />
        <div className="text-lg">Searching for “{q}”…</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {q && total > 0 && (
        <h2 className="text-2xl">
          {total} result{total !== 1 ? 's' : ''} for “{q}”
        </h2>
      )}
      {q && total === 0 && (
        <div className="text-xl">No results for “{q}.”</div>
      )}
      {total > 0 && <Section title="" items={results} />}
    </div>
  )
}
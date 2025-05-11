// src/components/SearchResults.jsx
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '../services/api.js'
import Section from './Section.jsx'

export default function SearchResults() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const term   = params.get('q') || ''

  const [results, setResults] = useState([])
  const [total, setTotal]     = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!term) return
    setLoading(true)
    api.get(`/search?t=${encodeURIComponent(term)}`)
      .then(res => {
        // your backend returns { total, results }
        setTotal(res.data.total)
        setResults(res.data.results)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [term])

  if (!term) {
    return <p className="p-6">Type something to search.</p>
  }

  if (loading) {
    return <p className="p-6">Searching for “{term}”…</p>
  }

  if (!results.length) {
    return <p className="p-6">No results for “{term}.”</p>
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">
        {total} result{total !== 1 && 's'} for “{term}”
      </h2>
      <Section title="" items={results} />
    </div>
  )
}
// src/services/api.js

// your existing base (e.g. http://localhost:8000 or production URL)
const RAW_BASE = import.meta.env.VITE_API_BASE || ''

// trim any trailing slash
const BASE = RAW_BASE.replace(/\/$/, '')

async function get(path) {
  // ensure we always hit /api/manhwa/<path>
  const url =
    BASE +
    '/api/manhwa' +
    (path.startsWith('/') ? path : '/' + path)

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

export const api = { get }
// src/services/api.js
const RAW_BASE = import.meta.env.VITE_API_BASE || ''

// strip trailing slash so BASE never ends in “/”
const BASE = RAW_BASE.replace(/\/$/, '')

export async function get(path) {
  // always prefix our router path
  const url = `${BASE}/api/manhwa${path.startsWith('/') ? path : '/' + path}`

  // remove any doubled‐up slash before the “?”
  const clean = url.replace(/([^:]\/)\/+/g, '$1')

  const res = await fetch(clean)
  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`)
  }
  return res.json()
}
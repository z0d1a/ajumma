// src/services/api.js

// grab your base from env, strip any trailing slash
const RAW_BASE = import.meta.env.VITE_API_BASE || ''
const BASE = RAW_BASE.replace(/\/$/, '')

// core fetch helper
async function get(path) {
  // ensure we always hit exactly `/api/manhwa` as the root
  // and never double-up slashes
  let url = `${BASE}/api/manhwa${path.startsWith('?') ? '' : '/'}${path}`
  // collapse any accidental "//" before the "?" or "/" parts
  url = url.replace(/([^:]\/)\/+/g, '$1')
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`)
  return res.json()
}

export const api = { get }
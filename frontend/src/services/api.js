// src/services/api.js
const RAW_BASE = import.meta.env.VITE_API_BASE || ''
// make sure there is no trailing slash
export const BASE =
  RAW_BASE.endsWith('/') ? RAW_BASE.slice(0, -1) : RAW_BASE

async function get(path) {
  // always prefix with a single slash
  const url = BASE + (path.startsWith('/') ? '' : '/') + path
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`)
  return res.json()
}

export const api = { get }
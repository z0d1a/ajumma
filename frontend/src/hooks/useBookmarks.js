// src/hooks/useBookmarks.js
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'ajumma:bookmarks'

export function useBookmarks() {
  const [list, setList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  // every time it changes, persist back to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  }, [list])

  const add = manhwa => {
    if (!list.find(m => m.slug === manhwa.slug)) {
      setList([...list, manhwa])
    }
  }

  const remove = slug => {
    setList(list.filter(m => m.slug !== slug))
  }

  const isBookmarked = slug => list.some(m => m.slug === slug)

  return { list, add, remove, isBookmarked }
}

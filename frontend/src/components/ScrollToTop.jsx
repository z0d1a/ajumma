import React, { useState, useEffect } from 'react'
import { ArrowUpIcon } from '@heroicons/react/24/solid'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  // Show button as soon as user scrolls down 100px
  useEffect(() => {
    const onScroll = () => setVisible(window.pageYOffset > 100)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return visible ? (
    <button
      onClick={handleClick}
      className="
        fixed bottom-6 right-6
        p-3 rounded-full
        bg-gray-700 hover:bg-gray-600 active:bg-gray-800
        text-white shadow-lg
        focus:outline-none focus:ring
        transition
        z-50
      "
      aria-label="Scroll to top"
    >
      <ArrowUpIcon className="w-5 h-5" />
    </button>
  ) : null
}
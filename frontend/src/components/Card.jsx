import React from 'react'
import { Link } from 'react-router-dom'
import { StarIcon } from '@heroicons/react/24/solid'

export default function Card({ title, cover, to, rating }) {
  return (
    <Link
      to={to}
      className="group block bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md
                 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 animate-fadeIn"
    >
      <div className="relative pb-[150%] overflow-hidden">
        <img
          src={cover}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {typeof rating === 'number' && (
          <div className="flex items-center mt-1 text-gray-600 dark:text-gray-300">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1 flex-shrink-0" />
            <span className="text-xs">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  )
}
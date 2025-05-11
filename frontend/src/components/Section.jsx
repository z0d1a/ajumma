import React from 'react'
import Card from './Card.jsx'

export default function Section({ title, items }) {
  return (
    <section className="space-y-4 animate-fadeIn">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {items.map((item, i) => {
          // extract the slug from the API link
          const url = new URL(item.link)
          const slug = url.searchParams.get('m')
          return (
            <div
              key={slug || i}
              className="snap-start animate-fadeInUp"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <Card
                title={item.title}
                cover={item.cover_url}
                to={`/manhwa/${slug}`}
                rating={item.rating}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
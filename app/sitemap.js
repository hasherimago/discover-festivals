import { FESTIVALS } from '../public/data.js'

function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function sitemap() {
  const festivalUrls = FESTIVALS.map((f) => ({
    url: `https://curatedfestivals.com/festivals/${toSlug(f.name)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    {
      url: 'https://curatedfestivals.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...festivalUrls,
  ]
}

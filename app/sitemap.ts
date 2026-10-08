import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://kizakixd.my.id', priority: 1 }, { url: 'https://kizakixd.my.id/quick', priority: 0.9 }]
}

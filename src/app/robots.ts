import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio/', '/admin/', '/checkout/', '/koshnitsa/', '/api/'],
    },
    sitemap: 'https://eleganssastudio.com/sitemap.xml',
  }
}

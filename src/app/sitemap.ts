import { MetadataRoute } from 'next'
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'

const BASE_URL = 'https://eleganssastudio.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE_URL}/rabotilnitsi`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/magazin`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/vaucheri`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/za-nas`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/kontakti`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/politika-za-poveritelnost`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/obshti-uslovia`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/pravo-na-otkaz`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  let workshopPages: MetadataRoute.Sitemap = []
  let productPages: MetadataRoute.Sitemap = []

  try {
    const workshops = await client.fetch<{ slug: string; _updatedAt: string }[]>(
      groq`*[_type == "workshop" && active == true]{ "slug": slug.current, _updatedAt }`
    )
    workshopPages = workshops.map((w) => ({
      url: `${BASE_URL}/rabotilnitsi/${w.slug}`,
      lastModified: new Date(w._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    const products = await client.fetch<{ slug: string; _updatedAt: string }[]>(
      groq`*[_type == "product"]{ "slug": slug.current, _updatedAt }`
    )
    productPages = products.map((p) => ({
      url: `${BASE_URL}/magazin/${p.slug}`,
      lastModified: new Date(p._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch (_) {}

  return [...staticPages, ...workshopPages, ...productPages]
}

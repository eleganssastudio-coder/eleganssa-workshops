import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { client } from '@/sanity/client'
import { workshopBySlugQuery } from '@/sanity/queries'
import WorkshopDetailClient from './WorkshopDetailClient'

export const revalidate = 60

async function getWorkshop(slug: string) {
  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      return await client.fetch(workshopBySlugQuery, { slug })
    }
  } catch (_) {}
  return null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const workshop = await getWorkshop(params.slug)
  if (!workshop) return {}
  return {
    title: workshop.title,
    description: workshop.shortDescription || `Работилница "${workshop.title}" в Eleganssa Studio — Варна. ${workshop.price ? `Цена: ${workshop.price}€.` : ''}`,
    openGraph: {
      title: workshop.title,
      description: workshop.shortDescription || '',
      images: workshop.image ? [{ url: workshop.image }] : [],
    },
  }
}

export default async function WorkshopDetailPage({ params }: { params: { slug: string } }) {
  const workshop = await getWorkshop(params.slug)

  if (!workshop) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: workshop.title,
    description: workshop.shortDescription || '',
    image: workshop.image || undefined,
    organizer: {
      '@type': 'Organization',
      name: 'Eleganssa Studio',
      url: 'https://eleganssastudio.com',
    },
    location: {
      '@type': 'Place',
      name: 'Eleganssa Studio',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Варна',
        addressCountry: 'BG',
      },
    },
    offers: workshop.price ? {
      '@type': 'Offer',
      price: workshop.price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `https://eleganssastudio.com/rabotilnitsi/${params.slug}`,
    } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WorkshopDetailClient workshop={workshop} />
    </>
  )
}

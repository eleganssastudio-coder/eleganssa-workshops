import { notFound } from 'next/navigation'
import { client } from '@/sanity/client'
import { workshopBySlugQuery } from '@/sanity/queries'
import WorkshopDetailClient from './WorkshopDetailClient'

export const revalidate = 60

export default async function WorkshopDetailPage({ params }: { params: { slug: string } }) {
  let workshop = null

  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      workshop = await client.fetch(workshopBySlugQuery, { slug: params.slug })
    }
  } catch (e) {
    // fallback below
  }

  if (!workshop) {
    notFound()
  }

  return <WorkshopDetailClient workshop={workshop} />
}

import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { legalPageQuery } from '@/sanity/queries'
import { PortableText } from '@portabletext/react'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Политика за поверителност',
}

const FALLBACK_BODY = [
  { _type: 'block', _key: '1', style: 'h2', children: [{ _type: 'span', text: '1. Информация за администратора' }] },
  { _type: 'block', _key: '2', style: 'normal', children: [{ _type: 'span', text: 'Eleganssa Studio е администратор на лични данни по смисъла на Регламент (ЕС) 2016/679 (GDPR). Седалище: Варна, ул. Бреза 2, България. Имейл: eleganssastudio@gmail.com.' }] },
]

export default async function PolitikaZaPoveritelnostPage() {
  let page: any = null
  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      page = await client.fetch(legalPageQuery, { slug: 'politika-za-poveritelnost' })
    }
  } catch (_) {}

  const title = page?.title ?? 'Политика за поверителност'
  const subtitle = page?.subtitle ?? 'Правна информация'
  const body = page?.body ?? FALLBACK_BODY
  const lastUpdated = page?.lastUpdated ?? 'Декември 2024'

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <p className="section-subtitle">{subtitle}</p>
        <h1 className="font-serif text-5xl text-navy">{title}</h1>
        <div className="w-16 h-px bg-sage mt-4" />
      </div>
      <div className="font-sans text-navy/70 space-y-4 leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-navy [&_h2]:mb-2 [&_h2]:mt-8 [&_h3]:font-serif [&_h3]:text-xl [&_h3]:text-navy [&_h3]:mb-2 [&_h3]:mt-6 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_strong]:font-semibold [&_em]:italic">
        <PortableText value={body} />
        <p className="text-sm text-navy/40 pt-4">Последна актуализация: {lastUpdated}</p>
      </div>
    </div>
  )
}

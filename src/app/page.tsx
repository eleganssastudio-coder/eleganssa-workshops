import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Leaf, Sparkles, Heart } from 'lucide-react'
import WorkshopCard from '@/components/ui/WorkshopCard'
import StarRating from '@/components/ui/StarRating'
import NewProductsCarousel from '@/components/ui/NewProductsCarousel'
import { client } from '@/sanity/client'
import { featuredProductsQuery, newProductsQuery, promoProductsQuery, workshopsQuery, featuredReviewsQuery, homepageQuery } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Начало',
  description: 'Eleganssa Studio - ателие за ръчно изработени соеви свещи и Jesmonite изделия. Твори. Миксирай. Създай.',
}

const ICON_MAP: Record<string, typeof Leaf> = { leaf: Leaf, sparkles: Sparkles, heart: Heart }

const DEFAULT_PILLARS = [
  { icon: 'leaf', title: 'Натурални материали', desc: 'Използваме само 100% натурален соев восък, парфюмни масла без химикали и естествени пигменти.' },
  { icon: 'sparkles', title: 'Ръчна изработка', desc: 'Всеки продукт е изработен ръчно с внимание към детайлите. Няма два абсолютно еднакви изделия.' },
  { icon: 'heart', title: 'Уникален дизайн', desc: 'Минималистичен, модерен дизайн, вдъхновен от природата и съвременната естетика.' },
]

const STATIC_PRODUCTS = [
  { id: '1', name: 'Соева свещ "Лавандула и ванилия"', slug: 'soeva-sveshta-lavandula-vaniliya', price: 28, comparePrice: 35, images: ['https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800'], inStock: true, featured: true, category: { name: 'Соеви свещи', slug: 'soevi-sveshti' } },
  { id: '2', name: 'Соева свещ "Морски бриз"', slug: 'soeva-sveshta-morski-briz', price: 25, comparePrice: null, images: ['https://images.unsplash.com/photo-1602607703866-e4a1437cf5b7?w=800'], inStock: true, featured: true, category: { name: 'Соеви свещи', slug: 'soevi-sveshti' } },
  { id: '4', name: 'Jesmonite купа "Мрамор"', slug: 'jesmonite-kupa-mramor', price: 45, comparePrice: null, images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800'], inStock: true, featured: true, category: { name: 'Jesmonite изделия', slug: 'jesmonite-izdeliya' } },
  { id: '7', name: 'Подаръчен комплект "Уют"', slug: 'podarachen-komplekt-uyut', price: 85, comparePrice: 108, images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800'], inStock: true, featured: true, category: { name: 'Комплекти', slug: 'komplekti' } },
]

const STATIC_WORKSHOPS = [
  { id: '1', title: 'Работилница за соеви свещи', slug: 'rabotilnitsa-soevi-sveshti', shortDescription: 'Научете изкуството на правенето на соеви свещи.', image: 'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800', price: 39, duration: '2.5 часа', maxSpots: 8 },
  { id: '2', title: 'Работилница за Jesmonite изделия', slug: 'rabotilnitsa-jesmonite', shortDescription: 'Открийте магията на Jesmonite.', image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800', price: 45, duration: '3 часа', maxSpots: 6 },
  { id: '3', title: 'Комбинирана работилница', slug: 'rabotilnitsa-kombinirana', shortDescription: 'Направете и свещ, и Jesmonite изделие.', image: 'https://images.unsplash.com/photo-1543854589-b3cc58d5f27e?w=800', price: 69, duration: '4 часа', maxSpots: 6 },
]

const STATIC_REVIEWS = [
  { id: '1', author: 'Мария Д.', rating: 5, title: 'Невероятно преживяване!', body: 'Работилницата за соеви свещи беше фантастична!', date: 'Ноември 2024' },
  { id: '2', author: 'Елена К.', rating: 5, title: 'Перфектен подарък', body: 'Купих подаръчен комплект за рождения ден на приятелката ми. Тя беше в екстаз!', date: 'Октомври 2024' },
  { id: '3', author: 'Петя М.', rating: 5, title: 'Качеството говори само за себе си', body: 'Jesmonite купата е абсолютен шедьовър.', date: 'Декември 2024' },
]

export const revalidate = 60

export default async function HomePage() {
  let featuredProducts: any[] = []
  let newProducts: any[] = []
  let promoProducts: any[] = []
  let workshops: any[] = []
  let reviews: any[] = []
  let hp: any = {}

  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      featuredProducts = await client.fetch(featuredProductsQuery) || []
      newProducts = await client.fetch(newProductsQuery) || []
      promoProducts = await client.fetch(promoProductsQuery) || []
      workshops = await client.fetch(workshopsQuery) || []
      reviews = await client.fetch(featuredReviewsQuery) || []
      hp = await client.fetch(homepageQuery) || {}
    }
  } catch (e) {}

  if (!featuredProducts.length) featuredProducts = STATIC_PRODUCTS
  else featuredProducts = featuredProducts.map((p: any) => ({ ...p, id: p._id || p.id || p.slug, images: Array.isArray(p.images) ? p.images.filter(Boolean) : [] }))
  newProducts = newProducts.map((p: any) => ({ ...p, id: p._id || p.id || p.slug, images: Array.isArray(p.images) ? p.images.filter(Boolean) : [] }))
  promoProducts = promoProducts.map((p: any) => ({ ...p, id: p._id || p.id || p.slug, images: Array.isArray(p.images) ? p.images.filter(Boolean) : [] }))
  if (!workshops.length) workshops = STATIC_WORKSHOPS
  if (!reviews.length) reviews = STATIC_REVIEWS

  // Hero
  const heroImage = hp.heroImage || 'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=1600'
  const heroOverlay = hp.heroOverlayOpacity ?? 50
  const isLight = (hp.heroTextColor ?? 'light') === 'light'
  const textBase = isLight ? 'text-cream' : 'text-navy'
  const textMuted = isLight ? 'text-cream/70' : 'text-navy/70'
  const textFaint = isLight ? 'text-cream/50' : 'text-navy/50'

  // Pillars
  const pillars: { icon: string; title: string; desc: string }[] = hp.pillars?.length ? hp.pillars : DEFAULT_PILLARS

  // Workshop CTA
  const wsImage = hp.workshopCtaImage || 'https://images.unsplash.com/photo-1543854589-b3cc58d5f27e?w=1600'
  const wsOverlay = hp.workshopCtaOverlay ?? 70
  const wsBullets: string[] = hp.workshopCtaBullets?.length ? hp.workshopCtaBullets : ['Всички материали включени', 'Занасяте изделията си', 'От ~39€ на човек']

  return (
    <>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <Image src={heroImage} alt="Eleganssa Studio" fill className="object-cover" priority />
          {heroOverlay > 0 && (
            <div className="absolute inset-0 bg-navy" style={{ opacity: heroOverlay / 100 }} />
          )}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className={`text-sm tracking-widest uppercase font-sans mb-6 ${textFaint}`}>
              {hp.heroLabel || 'Ателие за ръчна изработка · Варна'}
            </p>
            <h1 className={`font-serif text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 ${textBase}`}>
              {hp.heroTitle || 'Твори. Миксирай. Създай.'}
            </h1>
            <p className={`font-sans text-lg mb-10 max-w-lg leading-relaxed ${textMuted}`}>
              {hp.heroSubtitle || 'Ръчно изработени соеви свещи, Jesmonite изделия и творчески работилници в сърцето на Варна.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href={hp.heroCta1Link || '/magazin'} className="btn-terracotta">
                {hp.heroCta1Label || 'Разгледай магазина'}
              </Link>
              <Link href={hp.heroCta2Link || '/rabotilnitsi'} className={`border px-6 py-3 font-sans text-sm tracking-widest uppercase transition-colors duration-300 ${isLight ? 'border-cream text-cream hover:bg-cream hover:text-navy' : 'border-navy text-navy hover:bg-navy hover:text-cream'}`}>
                {hp.heroCta2Label || 'Запиши се за работилница'}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-cream/40 mx-auto animate-pulse" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-navy py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-cream/10">
          {[
            { value: '200+', label: 'ИЗРАБОТЕНИ ИЗДЕЛИЯ' },
            { value: '50+', label: 'ПРОВЕДЕНИ РАБОТИЛНИЦИ' },
            { value: '100%', label: 'ЕСТЕСТВЕНИ МАТЕРИАЛИ' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center py-10 gap-3">
              <span className="font-serif text-5xl md:text-6xl" style={{ color: '#C9A96E' }}>{stat.value}</span>
              <span className="font-sans text-xs tracking-widest text-cream/50 uppercase">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* New Products Carousel */}
      <NewProductsCarousel products={newProducts} />

      {/* Pillars */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {pillars.map((pillar) => {
              const Icon = ICON_MAP[pillar.icon] || Leaf
              return (
                <div key={pillar.title} className="text-center">
                  <div className="w-12 h-12 border border-sage flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-sage" />
                  </div>
                  <h3 className="font-serif text-xl text-navy mb-3">{pillar.title}</h3>
                  <p className="text-navy/60 font-sans text-sm leading-relaxed">{pillar.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Promo Products Carousel */}
      <NewProductsCarousel products={promoProducts.length ? promoProducts : featuredProducts.filter((p: any) => p.comparePrice && p.comparePrice > p.price)} title="ПРОМО" />

      {/* Workshop CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={wsImage} alt="Работилница" fill className="object-cover" />
          {wsOverlay > 0 && (
            <div className="absolute inset-0 bg-navy" style={{ opacity: wsOverlay / 100 }} />
          )}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-cream/70 text-sm tracking-widest uppercase font-sans mb-4">
            {hp.workshopCtaLabel || 'Преоткрий творчеството в теб'}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream mb-6">
            {hp.workshopCtaTitle || 'Работилници за всеки'}
          </h2>
          <p className="text-cream/70 font-sans max-w-xl mx-auto mb-8 text-lg">
            {hp.workshopCtaText || 'Присъединете се към нашите работилници и научете изкуството на правенето на свещи и Jesmonite изделия.'}
          </p>
          {wsBullets.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              {wsBullets.map((b: string) => (
                <div key={b} className="text-cream/60 font-sans text-sm">✓ {b}</div>
              ))}
            </div>
          )}
          <Link href="/rabotilnitsi" className="btn-terracotta text-base">
            {hp.workshopCtaBtnLabel || 'Разгледай работилниците'}
          </Link>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="py-20 bg-light-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Предстоящи</p>
            <h2 className="section-title">Нашите работилници</h2>
            <div className="w-16 h-px bg-sage mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {workshops.map((workshop: any) => (
              <WorkshopCard key={workshop._id || workshop.id} workshop={workshop} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Мнения</p>
            <h2 className="section-title">Какво казват клиентите</h2>
            <div className="w-16 h-px bg-sage mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review: any) => (
              <div key={review._id || review.id} className="bg-light-cream p-8">
                <StarRating rating={review.rating} className="mb-4" />
                <h4 className="font-serif text-lg text-navy mb-3">{review.title}</h4>
                <p className="text-navy/60 font-sans text-sm leading-relaxed mb-6 italic">&ldquo;{review.body}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <p className="font-sans text-sm font-medium text-navy">{review.author}</p>
                  <p className="text-navy/40 font-sans text-xs">{review.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-cream/70 text-sm tracking-widest uppercase font-sans mb-4">Изкуство за дома, ръчно направено с любов</p>
          <h2 className="font-serif text-4xl text-cream mb-4">
            {hp.newsletterTitle || 'Бъди в час с новостите'}
          </h2>
          <p className="text-cream/60 font-sans mb-8 max-w-md mx-auto">
            {hp.newsletterText || 'Абонирай се и получавай информация за нови продукти, предстоящи работилници и специални оферти.'}
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Вашият имейл адрес" className="flex-1 px-4 py-3 bg-transparent border border-cream/30 text-cream placeholder-cream/40 font-sans text-sm focus:outline-none focus:border-cream transition-colors" />
            <button type="submit" className="bg-terracotta text-cream px-6 py-3 font-sans text-sm tracking-widest uppercase hover:opacity-90 transition-opacity whitespace-nowrap">
              Абонирай се
            </button>
          </form>
          <p className="text-cream/30 font-sans text-xs mt-4">Без спам. Можете да се отпишете по всяко време.</p>
        </div>
      </section>
    </>
  )
}

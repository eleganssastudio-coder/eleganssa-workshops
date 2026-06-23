import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowRight, Leaf, Sparkles, Heart } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import WorkshopCard from '@/components/ui/WorkshopCard'
import StarRating from '@/components/ui/StarRating'

export const metadata: Metadata = {
  title: 'Начало',
  description:
    'Eleganssa Studio - ателие за ръчно изработени соеви свещи и Jesmonite изделия. Твори. Миксирай. Създай.',
}

const featuredProducts = [
  {
    id: '1',
    name: 'Соева свещ "Лавандула и ванилия"',
    slug: 'soeva-sveshta-lavandula-vaniliya',
    price: 28,
    comparePrice: 35,
    images: ['https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800'],
    inStock: true,
    featured: true,
    category: { name: 'Соеви свещи', slug: 'soevi-sveshti' },
  },
  {
    id: '2',
    name: 'Soeva свещ "Морски бриз"',
    slug: 'soeva-sveshta-morski-briz',
    price: 25,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1602607703866-e4a1437cf5b7?w=800'],
    inStock: true,
    featured: true,
    category: { name: 'Соеви свещи', slug: 'soevi-sveshti' },
  },
  {
    id: '4',
    name: 'Jesmonite купа "Мрамор"',
    slug: 'jesmonite-kupa-mramor',
    price: 45,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800'],
    inStock: true,
    featured: true,
    category: { name: 'Jesmonite изделия', slug: 'jesmonite-izdeliya' },
  },
  {
    id: '7',
    name: 'Подаръчен комплект "Уют"',
    slug: 'podarachen-komplekt-uyut',
    price: 85,
    comparePrice: 108,
    images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800'],
    inStock: true,
    featured: true,
    category: { name: 'Комплекти', slug: 'komplekti' },
  },
]

const workshops = [
  {
    id: '1',
    title: 'Работилница за соеви свещи',
    slug: 'rabotilnitsa-soevi-sveshti',
    shortDesc: 'Научете изкуството на правенето на соеви свещи. Ще си тръгнете с две ръчно изработени свещи.',
    image: 'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800',
    price: 39,
    duration: '2.5 часа',
    maxSpots: 8,
  },
  {
    id: '2',
    title: 'Работилница за Jesmonite изделия',
    slug: 'rabotilnitsa-jesmonite',
    shortDesc: 'Открийте магията на Jesmonite. Ще изработите декоративна купа или поднос.',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
    price: 45,
    duration: '3 часа',
    maxSpots: 6,
  },
  {
    id: '3',
    title: 'Комбинирана работилница',
    slug: 'rabotilnitsa-soevi-sveshti',
    shortDesc: 'Направете и свещ, и Jesmonite изделие в едно незабравимо следобедно събитие.',
    image: 'https://images.unsplash.com/photo-1543854589-b3cc58d5f27e?w=800',
    price: 69,
    duration: '4 часа',
    maxSpots: 6,
  },
]

const reviews = [
  {
    id: '1',
    author: 'Мария Д.',
    rating: 5,
    title: 'Невероятно преживяване!',
    body: 'Работилницата за соеви свещи беше фантастична! Боряна е страхотен инструктор - търпелива, вдъхновяваща и много знаеща. Ще се върна определено!',
    date: 'Ноември 2024',
  },
  {
    id: '2',
    author: 'Елена К.',
    rating: 5,
    title: 'Перфектен подарък',
    body: 'Купих подаръчен комплект за рождения ден на приятелката ми. Опаковката беше красива, свещите миришат невероятно. Тя беше в екстаз!',
    date: 'Октомври 2024',
  },
  {
    id: '3',
    author: 'Петя М.',
    rating: 5,
    title: 'Качеството говори само за себе си',
    body: 'Jesmonite купата е абсолютен шедьовър. Всеки, който идва у нас, пита откъде е. Много съм доволна от покупката си!',
    date: 'Декември 2024',
  },
]

const pillars = [
  {
    icon: Leaf,
    title: 'Натурални материали',
    desc: 'Използваме само 100% натурален соев восък, парфюмни масла без химикали и естествени пигменти.',
  },
  {
    icon: Sparkles,
    title: 'Ръчна изработка',
    desc: 'Всеки продукт е изработен ръчно с внимание към детайлите. Няма два абсолютно еднакви изделия.',
  },
  {
    icon: Heart,
    title: 'Уникален дизайн',
    desc: 'Минималистичен, модерен дизайн, вдъхновен от природата и съвременната естетика.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=1600"
            alt="Eleganssa Studio - ръчно изработени соеви свещи"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sage text-sm tracking-widest uppercase font-sans mb-6 text-cream/70">
              Ателие за ръчна изработка · Варна
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream leading-tight mb-6">
              Твори.{' '}
              <em>Миксирай.</em>{' '}
              Създай.
            </h1>
            <p className="text-cream/80 font-sans text-lg mb-10 max-w-lg leading-relaxed">
              Ръчно изработени соеви свещи, Jesmonite изделия и творчески работилници в сърцето на Варна.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/magazin" className="btn-terracotta">
                Разгледай магазина
              </Link>
              <Link href="/rabotilnitsi" className="border border-cream text-cream px-6 py-3 font-sans text-sm tracking-widest uppercase hover:bg-cream hover:text-navy transition-colors duration-300">
                Запиши се за работилница
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-px h-16 bg-cream/40 mx-auto animate-pulse" />
        </div>
      </section>

      {/* Pillars */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="text-center">
                <div className="w-12 h-12 border border-sage flex items-center justify-center mx-auto mb-4">
                  <pillar.icon className="w-5 h-5 text-sage" />
                </div>
                <h3 className="font-serif text-xl text-navy mb-3">{pillar.title}</h3>
                <p className="text-navy/60 font-sans text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-light-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="section-subtitle">Нашите продукти</p>
            <h2 className="section-title">Избрани изделия</h2>
            <div className="w-16 h-px bg-sage mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/magazin" className="btn-outline inline-flex items-center gap-2">
              Виж всички продукти
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Workshop CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1543854589-b3cc58d5f27e?w=1600"
            alt="Работилница за свещи"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-navy/70" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sage text-sm tracking-widest uppercase font-sans mb-4">
            Творчески преживявания
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-cream mb-6">
            Работилници за всеки
          </h2>
          <p className="text-cream/70 font-sans max-w-xl mx-auto mb-8 text-lg">
            Присъединете се към нашите работилници и научете изкуството на правенето на свещи и Jesmonite изделия. Перфектно за приятели, двойки и корпоративни тийм билдинги.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <div className="text-cream/60 font-sans text-sm">
              ✓ Всички материали включени
            </div>
            <div className="text-cream/60 font-sans text-sm">
              ✓ Занасяте изделията си
            </div>
            <div className="text-cream/60 font-sans text-sm">
              ✓ От ~39€ на човек
            </div>
          </div>
          <Link href="/rabotilnitsi" className="btn-terracotta text-base">
            Разгледай работилниците
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
            {workshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
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
            {reviews.map((review) => (
              <div key={review.id} className="bg-light-cream p-8">
                <StarRating rating={review.rating} className="mb-4" />
                <h4 className="font-serif text-lg text-navy mb-3">{review.title}</h4>
                <p className="text-navy/60 font-sans text-sm leading-relaxed mb-6 italic">
                  &ldquo;{review.body}&rdquo;
                </p>
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
          <p className="text-sage text-sm tracking-widest uppercase font-sans mb-4">
            Бюлетин
          </p>
          <h2 className="font-serif text-4xl text-cream mb-4">
            Бъди в час с новостите
          </h2>
          <p className="text-cream/60 font-sans mb-8 max-w-md mx-auto">
            Абонирай се и получавай информация за нови продукти, предстоящи работилници и специални оферти.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Вашият имейл адрес"
              className="flex-1 px-4 py-3 bg-transparent border border-cream/30 text-cream placeholder-cream/40 font-sans text-sm focus:outline-none focus:border-cream transition-colors"
            />
            <button
              type="submit"
              className="bg-terracotta text-cream px-6 py-3 font-sans text-sm tracking-widest uppercase hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Абонирай се
            </button>
          </form>
          <p className="text-cream/30 font-sans text-xs mt-4">
            Без спам. Можете да се отпишете по всяко време.
          </p>
        </div>
      </section>
    </>
  )
}

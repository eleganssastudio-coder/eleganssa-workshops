import type { Metadata } from 'next'
import Image from 'next/image'
import WorkshopCard from '@/components/ui/WorkshopCard'
import { CheckCircle } from 'lucide-react'
import { client } from '@/sanity/client'
import { workshopsQuery, workshopsPageQuery } from '@/sanity/queries'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Работилници',
  description:
    'Творчески работилници за соеви свещи и Jesmonite изделия в Eleganssa Studio, Варна. Запишете се онлайн.',
}

const DEFAULT_BENEFITS = [
  'Всички материали са включени в цената',
  'Малки групи - до 8 участника',
  'Водено от опитен инструктор',
  'Занасяте изделията си вкъщи',
  'Чай и лека закуска',
  'Сертификат за участие',
  'Подходящо за всички нива',
  'Перфектно за корпоративни тийм билдинги',
]

const DEFAULT_PRIVATE_BULLETS = [
  'Минимум 4, максимум 15 участника',
  'Гъвкав график - изберете вашата дата и час',
  'Персонализирана програма по ваши желания',
  'Специална цена за групи',
]

export default async function RabotilnitsiPage() {
  let workshops: any[] = []
  let page: any = null

  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      ;[workshops, page] = await Promise.all([
        client.fetch(workshopsQuery),
        client.fetch(workshopsPageQuery),
      ])
      workshops = workshops || []
    }
  } catch (_) {}

  const heroLabel = page?.heroLabel ?? 'Творчески преживявания'
  const heroTitle = page?.heroTitle ?? 'Работилници'
  const heroText = page?.heroText ?? 'Присъединете се към нашите творчески работилници и се потопете в света на ръчната изработка. Подходящи за начинаещи и напреднали, за приятели, двойки и корпоративни групи.'
  const benefits: string[] = page?.benefits?.length ? page.benefits : DEFAULT_BENEFITS
  const privateLabel = page?.privateLabel ?? 'За вашата група'
  const privateTitle = page?.privateTitle ?? 'Частни и корпоративни работилници'
  const privateText = page?.privateText ?? 'Организираме частни работилници за рождени дни, моминско парти, корпоративен тийм билдинг и всеки специален повод. Свържете се с нас за персонализирана оферта.'
  const privateBullets: string[] = page?.privateBullets?.length ? page.privateBullets : DEFAULT_PRIVATE_BULLETS
  const privateImage = page?.privateImage ?? 'https://images.unsplash.com/photo-1543854589-b3cc58d5f27e?w=800'
  const privateBtnLabel = page?.privateBtnLabel ?? 'Свържи се с нас'
  const privateBtnEmail = page?.privateBtnEmail ?? 'eleganssastudio@gmail.com'

  return (
    <>
      {/* Hero */}
      <div className="relative bg-cream py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="section-subtitle">{heroLabel}</p>
            <h1 className="font-serif text-5xl md:text-6xl text-navy mb-6">{heroTitle}</h1>
            <p className="font-sans text-navy/70 text-lg leading-relaxed">{heroText}</p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <section className="bg-navy py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                <span className="text-cream/80 font-sans text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshops */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {workshops.map((workshop: any) => (
              <WorkshopCard key={workshop._id || workshop.id} workshop={workshop} />
            ))}
          </div>
        </div>
      </section>

      {/* Private events */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={privateImage}
                alt={privateTitle}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="section-subtitle">{privateLabel}</p>
              <h2 className="font-serif text-4xl text-navy mb-6">{privateTitle}</h2>
              <p className="font-sans text-navy/70 leading-relaxed mb-6">{privateText}</p>
              <ul className="space-y-3 mb-8">
                {privateBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3 font-sans text-sm text-navy/70">
                    <CheckCircle className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href={`mailto:${privateBtnEmail}`} className="btn-primary">
                {privateBtnLabel}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

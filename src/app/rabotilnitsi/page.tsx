import type { Metadata } from 'next'
import Image from 'next/image'
import WorkshopCard from '@/components/ui/WorkshopCard'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Работилници',
  description:
    'Творчески работилници за соеви свещи и Jesmonite изделия в Eleganssa Studio, Варна. Запишете се онлайн.',
}

const workshops = [
  {
    id: '1',
    title: 'Работилница за соеви свещи',
    slug: 'rabotilnitsa-soevi-sveshti',
    shortDesc: 'Научете изкуството на правенето на соеви свещи. Ще си тръгнете с две ръчно изработени свещи и знанието да правите свои собствени.',
    image: 'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800',
    price: 39,
    duration: '2.5 часа',
    maxSpots: 8,
  },
  {
    id: '2',
    title: 'Работилница за Jesmonite изделия',
    slug: 'rabotilnitsa-jesmonite',
    shortDesc: 'Открийте магията на Jesmonite. Ще изработите декоративна купа или поднос с уникален ефект.',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
    price: 45,
    duration: '3 часа',
    maxSpots: 6,
  },
]

const benefits = [
  'Всички материали са включени в цената',
  'Малки групи - до 8 участника',
  'Водено от опитен инструктор',
  'Занасяте изделията си вкъщи',
  'Чай и лека закуска',
  'Сертификат за участие',
  'Подходящо за всички нива',
  'Перфектно за корпоративни тийм билдинги',
]

export default function RabotilnitsiPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative bg-cream py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="section-subtitle">Творчески преживявания</p>
            <h1 className="font-serif text-5xl md:text-6xl text-navy mb-6">Работилници</h1>
            <p className="font-sans text-navy/70 text-lg leading-relaxed">
              Присъединете се към нашите творчески работилници и се потопете в света на ръчната изработка. Подходящи за начинаещи и напреднали, за приятели, двойки и корпоративни групи.
            </p>
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
            {workshops.map((workshop) => (
              <WorkshopCard key={workshop.id} workshop={workshop} />
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
                src="https://images.unsplash.com/photo-1543854589-b3cc58d5f27e?w=800"
                alt="Частни работилници"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="section-subtitle">За вашата група</p>
              <h2 className="font-serif text-4xl text-navy mb-6">
                Частни и корпоративни работилници
              </h2>
              <p className="font-sans text-navy/70 leading-relaxed mb-6">
                Организираме частни работилници за рождени дни, моминско парти, корпоративен тийм билдинг и всеки специален повод. Свържете се с нас за персонализирана оферта.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Минимум 4, максимум 15 участника',
                  'Гъвкав график - изберете вашата дата и час',
                  'Персонализирана програма по ваши желания',
                  'Специална цена за групи',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 font-sans text-sm text-navy/70">
                    <CheckCircle className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:eleganssastudio@gmail.com"
                className="btn-primary"
              >
                Свържи се с нас
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

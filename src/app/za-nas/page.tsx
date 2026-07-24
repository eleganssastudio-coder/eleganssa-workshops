import type { Metadata } from 'next'
import Image from 'next/image'
import { Leaf, Heart, Sparkles, Instagram } from 'lucide-react'
import { client } from '@/sanity/client'
import { aboutQuery } from '@/sanity/queries'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'За нас',
  description: 'Запознайте се с историята зад Eleganssa Studio - ателие за ръчно изработени соеви свещи и Jesmonite изделия от Варна.',
}

const ICON_MAP: Record<string, typeof Leaf> = { leaf: Leaf, heart: Heart, sparkles: Sparkles }

const DEFAULT_VALUES = [
  { icon: 'leaf', title: 'Натурални материали', desc: 'Работим само с натурален соев восък, безопасни парфюмни масла и екологичен Jesmonite. Без парафин, без вредни вещества.' },
  { icon: 'heart', title: 'С любов и внимание', desc: 'Всеки продукт е изработен ръчно с грижа и внимание. Не използваме машини - само ръце, сърце и търпение.' },
  { icon: 'sparkles', title: 'Уникалност', desc: 'Никой два продукта не са абсолютно еднакви. Всяко изделие носи своя уникален характер.' },
]

const DEFAULT_STORY = `Eleganssa Studio е ателие, родено от страстта към ръчната изработка и желанието да споделим тази магия с другите. Намираме се в сърцето на Варна, където всеки ден творим красиви изделия от натурални материали.

Всичко започна с един свободен следобед и желанието да запаля свещ, която не само да мирише прекрасно, но и да знам точно от какво е направена. Така се влюбихме в соевия восък и натуралните аромати.

Скоро след това открихме Jesmonite - модерен, екологичен материал, с който можете да създавате невероятно красиви декоративни изделия. Добавихме го към нашата палитра и никога не погледнахме назад.

Днес провеждаме творчески работилници, в които споделяме знанията си с всеки, който иска да се потопи в света на ръчната изработка.`

export default async function ZaNasPage() {
  let about: any = {}

  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      about = await client.fetch(aboutQuery) || {}
    }
  } catch (e) {}

  const heroImage = about.heroImage || 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1600'
  const overlay = about.heroOverlayOpacity ?? 60
  const mainImage = about.mainImage || 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800'
  const secondaryImage = about.secondaryImage || 'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=400'
  const values: { icon: string; title: string; desc: string }[] = about.values?.length ? about.values : DEFAULT_VALUES
  const storyText = about.storyBody || DEFAULT_STORY

  return (
    <>
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image src={heroImage} alt="За нас - Eleganssa Studio" fill className="object-cover" priority />
          {overlay > 0 && (
            <div className="absolute inset-0 bg-navy" style={{ opacity: overlay / 100 }} />
          )}
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-subtitle text-cream/60">{about.heroLabel || 'Нашата история'}</p>
          <h1 className="font-serif text-5xl md:text-6xl text-cream mb-4">{about.heroTitle || 'За нас'}</h1>
          {(about.heroSubtitle || true) && (
            <p className="font-serif italic text-cream/80 text-2xl">
              {about.heroSubtitle || '"Твори. Миксирай. Създай."'}
            </p>
          )}
        </div>
      </div>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <p className="section-subtitle">{about.storyLabel || 'Нашата история'}</p>
              <h2 className="font-serif text-4xl text-navy mb-6">
                {about.storyTitle || 'Родено от страст към ръчната изработка'}
              </h2>
              <div className="space-y-4 font-sans text-navy/70 leading-relaxed">
                {storyText.split('\n\n').filter(Boolean).map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image src={mainImage} alt="Eleganssa Studio ателие" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-cream border-8 border-light-cream overflow-hidden">
                <Image src={secondaryImage} alt="Соеви свещи" fill className="object-cover" />
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <p className="section-subtitle">{about.valuesLabel || 'Нашите ценности'}</p>
            <h2 className="section-title">{about.valuesTitle || 'Защо избираме натуралното'}</h2>
            <div className="w-16 h-px bg-sage mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            {values.map((value) => {
              const Icon = ICON_MAP[value.icon] || Leaf
              return (
                <div key={value.title} className="text-center bg-cream p-10">
                  <div className="w-12 h-12 border border-sage flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-5 h-5 text-sage" />
                  </div>
                  <h3 className="font-serif text-xl text-navy mb-3">{value.title}</h3>
                  <p className="font-sans text-sm text-navy/60 leading-relaxed">{value.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Instagram CTA */}
          <div className="text-center bg-navy py-16 px-8">
            <Instagram className="w-10 h-10 text-cream mx-auto mb-4" />
            <h2 className="font-serif text-3xl text-cream mb-4">
              {about.instagramTitle || 'Следете ни в Instagram'}
            </h2>
            <p className="font-sans text-cream/60 mb-6">
              {about.instagramText || 'Споделяме моменти от нашето ателие, нови продукти и предстоящи работилници.'}
            </p>
            <a
              href={about.instagramUrl || 'https://www.instagram.com/eleganssastudio/'}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-cream text-cream px-8 py-3 font-sans text-sm tracking-widest uppercase hover:bg-cream hover:text-navy transition-colors inline-block"
            >
              {about.instagramHandle || '@eleganssastudio'}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

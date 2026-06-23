import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Heart, Sparkles, Instagram } from 'lucide-react'

export const metadata: Metadata = {
  title: 'За нас',
  description:
    'Запознайте се с историята зад Eleganssa Studio - ателие за ръчно изработени соеви свещи и Jesmonite изделия от Варна.',
}

export default function ZaNasPage() {
  return (
    <>
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1600"
            alt="За нас - Eleganssa Studio"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-navy/60" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="section-subtitle text-cream/60">Нашата история</p>
          <h1 className="font-serif text-5xl md:text-6xl text-cream mb-4">За нас</h1>
          <p className="font-serif italic text-cream/80 text-2xl">
            "Твори. Миксирай. Създай."
          </p>
        </div>
      </div>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <p className="section-subtitle">Нашата история</p>
              <h2 className="font-serif text-4xl text-navy mb-6">
                Родено от страст към ръчната изработка
              </h2>
              <div className="space-y-4 font-sans text-navy/70 leading-relaxed">
                <p>
                  Eleganssa Studio е ателие, родено от страстта към ръчната изработка и желанието да споделим тази магия с другите. Намираме се в сърцето на Варна, където всеки ден творим красиви изделия от натурални материали.
                </p>
                <p>
                  Всичко започна с един свободен следобед и желанието да запаля свещ, която не само да мирише прекрасно, но и да знам точно от какво е направена. Така се влюбихме в соевия восък и натуралните аромати.
                </p>
                <p>
                  Скоро след това открихме Jesmonite - модерен, екологичен материал, с който можете да създавате невероятно красиви декоративни изделия. Добавихме го към нашата палитра и никога не погледнахме назад.
                </p>
                <p>
                  Днес провеждаме творчески работилници, в които споделяме знанията си с всеки, който иска да се потопи в света на ръчната изработка. Всяка работилница е малко приключение - за новаци и за опитни майстори.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[3/4] relative overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800"
                  alt="Eleganssa Studio ателие"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-cream border-8 border-light-cream overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=400"
                  alt="Соеви свещи"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="text-center mb-12">
            <p className="section-subtitle">Нашите ценности</p>
            <h2 className="section-title">Защо избираме натуралното</h2>
            <div className="w-16 h-px bg-sage mx-auto mt-4" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            {[
              {
                icon: Leaf,
                title: 'Натурални материали',
                desc: 'Работим само с натурален соев восък, безопасни парфюмни масла и екологичен Jesmonite. Без парафин, без вредни вещества.',
              },
              {
                icon: Heart,
                title: 'С любов и внимание',
                desc: 'Всеки продукт е изработен ръчно с грижа и внимание. Не използваме машини - само ръце, сърце и търпение.',
              },
              {
                icon: Sparkles,
                title: 'Уникалност',
                desc: 'Никой два продукта не са абсолютно еднакви. Всяко изделие носи своя уникален характер - точно като нас самите.',
              },
            ].map((value) => (
              <div key={value.title} className="text-center bg-cream p-10">
                <div className="w-12 h-12 border border-sage flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-5 h-5 text-sage" />
                </div>
                <h3 className="font-serif text-xl text-navy mb-3">{value.title}</h3>
                <p className="font-sans text-sm text-navy/60 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>

          {/* Instagram CTA */}
          <div className="text-center bg-navy py-16 px-8">
            <Instagram className="w-10 h-10 text-cream mx-auto mb-4" />
            <h2 className="font-serif text-3xl text-cream mb-4">Следете ни в Instagram</h2>
            <p className="font-sans text-cream/60 mb-6">
              Споделяме моменти от нашето ателие, нови продукти и предстоящи работилници.
            </p>
            <a
              href="https://www.instagram.com/eleganssastudio/"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-cream text-cream px-8 py-3 font-sans text-sm tracking-widest uppercase hover:bg-cream hover:text-navy transition-colors inline-block"
            >
              @eleganssastudio
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

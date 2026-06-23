'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, CheckCircle, ChevronRight, Calendar, Minus, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

const workshops: Record<string, {
  id: string
  title: string
  slug: string
  description: string
  shortDesc: string
  image: string
  price: number
  duration: string
  maxSpots: number
  includes: string[]
  steps: string[]
  sessions: { date: string; startTime: string; endTime: string; spotsLeft: number }[]
}> = {
  'rabotilnitsa-soevi-sveshti': {
    id: '1',
    title: 'Работилница за соеви свещи',
    slug: 'rabotilnitsa-soevi-sveshti',
    description: `Научете изкуството на правенето на соеви свещи в нашата уютна студио среда. Ще научите всичко за различните видове восъци, аромати и техники за изработка.

Ще работим с висококачествен 100% соев восък, ще избираме от над 20 аромата и ще създадем нашите собствени уникални свещи. Всеки участник ще изработи две свещи и ще получи рецепта и инструкции за домашна употреба.

Работилницата е подходяща за пълни начинаещи - не е необходим предишен опит. Ние осигуряваме всички материали и инструменти.`,
    shortDesc: 'Научете изкуството на правенето на соеви свещи. Ще си тръгнете с две ръчно изработени свещи.',
    image: 'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=1200',
    price: 39,
    duration: '2.5 часа',
    maxSpots: 8,
    includes: [
      'Всички материали и инструменти',
      'Две ръчно изработени соеви свещи',
      'Рецепта и инструкции за вкъщи',
      'Чай и лека закуска',
      'Сертификат за участие',
    ],
    steps: [
      'Запознаване с материалите и техниките',
      'Избор на аромати и пигменти',
      'Топене и смесване на восъка',
      'Заливане и украса',
      'Охлаждане и финален резултат',
    ],
    sessions: [
      { date: '2025-02-15', startTime: '10:00', endTime: '12:30', spotsLeft: 5 },
      { date: '2025-02-15', startTime: '14:00', endTime: '16:30', spotsLeft: 3 },
      { date: '2025-03-01', startTime: '10:00', endTime: '12:30', spotsLeft: 7 },
      { date: '2025-03-01', startTime: '14:00', endTime: '16:30', spotsLeft: 8 },
      { date: '2025-03-15', startTime: '10:00', endTime: '12:30', spotsLeft: 2 },
      { date: '2025-04-05', startTime: '14:00', endTime: '16:30', spotsLeft: 6 },
    ],
  },
  'rabotilnitsa-jesmonite': {
    id: '2',
    title: 'Работилница за Jesmonite изделия',
    slug: 'rabotilnitsa-jesmonite',
    description: `Открийте магията на Jesmonite - модерния материал, с който можете да правите красиви декоративни изделия. В тази работилница ще научите основните техники за работа с Jesmonite.

Ще научите как да смесвате Jesmonite, да добавяте пигменти и да постигате красиви ефекти като мрамор, терацо и геод. Всеки участник ще изработи едно декоративно изделие по избор - купа или поднос.

Jesmonite е водна минерална основа, напълно безопасна и екологична. Не е необходим предишен опит с материала.`,
    shortDesc: 'Открийте магията на Jesmonite. Ще изработите декоративна купа или поднос.',
    image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200',
    price: 45,
    duration: '3 часа',
    maxSpots: 6,
    includes: [
      'Всички материали (Jesmonite, пигменти, форми)',
      'Едно декоративно изделие по избор',
      'Инструкции и рецепти за вкъщи',
      'Чай и лека закуска',
      'Сертификат за участие',
    ],
    steps: [
      'Запознаване с Jesmonite и неговите свойства',
      'Подготовка на формите',
      'Смесване и оцветяване',
      'Заливане с техники (мрамор, терацо)',
      'Демолдиране и финишна обработка',
    ],
    sessions: [
      { date: '2025-02-22', startTime: '10:00', endTime: '13:00', spotsLeft: 4 },
      { date: '2025-03-08', startTime: '10:00', endTime: '13:00', spotsLeft: 6 },
      { date: '2025-03-22', startTime: '14:00', endTime: '17:00', spotsLeft: 3 },
    ],
  },
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function WorkshopDetailPage({ params }: { params: { slug: string } }) {
  const workshop = workshops[params.slug]
  const [selectedSession, setSelectedSession] = useState<number | null>(null)
  const [spots, setSpots] = useState(1)
  const [step, setStep] = useState<'select' | 'book' | 'done'>('select')
  const [form, setForm] = useState({ name: '', email: '', phone: '' })

  if (!workshop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-4xl text-navy mb-4">Работилницата не е намерена</h1>
        <Link href="/rabotilnitsi" className="btn-primary">Към работилниците</Link>
      </div>
    )
  }

  const session = selectedSession !== null ? workshop.sessions[selectedSession] : null

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Записването е изпратено! Ще получите потвърждение на имейла.')
    setStep('done')
  }

  return (
    <>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src={workshop.image}
            alt={workshop.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-navy/20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
          <nav className="flex items-center gap-2 text-sm font-sans text-cream/60 mb-4">
            <Link href="/" className="hover:text-cream">Начало</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/rabotilnitsi" className="hover:text-cream">Работилници</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-cream">{workshop.title}</span>
          </nav>
          <h1 className="font-serif text-4xl md:text-5xl text-cream mb-4">{workshop.title}</h1>
          <div className="flex items-center gap-6 text-cream/80 font-sans text-sm">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {workshop.duration}
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              До {workshop.maxSpots} участника
            </span>
            <span className="font-serif text-2xl text-cream">{formatPrice(workshop.price)}/човек</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="mb-12">
              <h2 className="font-serif text-3xl text-navy mb-6">За работилницата</h2>
              <p className="font-sans text-navy/70 leading-relaxed whitespace-pre-line">
                {workshop.description}
              </p>
            </div>

            {/* What's included */}
            <div className="mb-12">
              <h2 className="font-serif text-3xl text-navy mb-6">Какво включва</h2>
              <ul className="space-y-4">
                {workshop.includes.map((item) => (
                  <li key={item} className="flex items-start gap-4">
                    <CheckCircle className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-navy/70">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="mb-12">
              <h2 className="font-serif text-3xl text-navy mb-6">Програма</h2>
              <div className="space-y-4">
                {workshop.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-navy text-cream flex items-center justify-center font-serif text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="font-sans text-navy/70">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-cream p-8 sticky top-24">
              <div className="text-center mb-6">
                <p className="font-serif text-3xl text-navy">{formatPrice(workshop.price)}</p>
                <p className="font-sans text-sm text-navy/50">на участник</p>
              </div>

              {step === 'select' && (
                <>
                  <h3 className="font-serif text-xl text-navy mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Изберете дата и час
                  </h3>
                  <div className="space-y-3 mb-6">
                    {workshop.sessions.map((session, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSession(i)}
                        disabled={session.spotsLeft === 0}
                        className={`w-full text-left p-4 border-2 transition-colors ${
                          selectedSession === i
                            ? 'border-navy bg-navy text-cream'
                            : session.spotsLeft === 0
                            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                            : 'border-cream bg-white hover:border-navy'
                        }`}
                      >
                        <p className="font-sans text-sm font-medium mb-1">
                          {formatDate(session.date)}
                        </p>
                        <p className="font-sans text-xs">
                          {session.startTime} - {session.endTime}
                        </p>
                        <p className={`font-sans text-xs mt-1 ${
                          selectedSession === i ? 'text-cream/70' : 'text-sage'
                        }`}>
                          {session.spotsLeft === 0 ? 'Няма места' : `${session.spotsLeft} свободни места`}
                        </p>
                      </button>
                    ))}
                  </div>

                  {selectedSession !== null && (
                    <div className="mb-6">
                      <p className="font-sans text-sm font-medium text-navy mb-3">Брой участници</p>
                      <div className="flex items-center border border-navy/20 w-full justify-between">
                        <button
                          onClick={() => setSpots(Math.max(1, spots - 1))}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Minus className="w-4 h-4 text-navy" />
                        </button>
                        <span className="font-sans text-navy font-medium">{spots}</span>
                        <button
                          onClick={() => setSpots(Math.min(session?.spotsLeft ?? 1, spots + 1))}
                          className="w-10 h-10 flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <Plus className="w-4 h-4 text-navy" />
                        </button>
                      </div>
                      <p className="font-sans text-sm text-navy/50 mt-2 text-right">
                        Общо: {formatPrice(workshop.price * spots)}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (selectedSession === null) {
                        toast.error('Моля, изберете дата и час')
                        return
                      }
                      setStep('book')
                    }}
                    className="btn-primary w-full text-center"
                  >
                    Запиши се
                  </button>
                </>
              )}

              {step === 'book' && session && (
                <form onSubmit={handleBook}>
                  <h3 className="font-serif text-xl text-navy mb-4">Вашите данни</h3>
                  <div className="bg-navy/5 p-3 rounded mb-6 text-sm font-sans">
                    <p className="font-medium text-navy">{formatDate(session.date)}</p>
                    <p className="text-navy/60">{session.startTime} - {session.endTime} · {spots} {spots === 1 ? 'участник' : 'участника'}</p>
                    <p className="font-serif text-navy mt-1">{formatPrice(workshop.price * spots)}</p>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block font-sans text-sm text-navy mb-1">Имена</label>
                      <input
                        required
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-navy/20 px-3 py-2 font-sans text-sm text-navy bg-white focus:outline-none focus:border-navy"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-navy mb-1">Имейл</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-navy/20 px-3 py-2 font-sans text-sm text-navy bg-white focus:outline-none focus:border-navy"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-navy mb-1">Телефон</label>
                      <input
                        required
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full border border-navy/20 px-3 py-2 font-sans text-sm text-navy bg-white focus:outline-none focus:border-navy"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full text-center mb-3">
                    Потвърди записването
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('select')}
                    className="w-full text-center font-sans text-sm text-navy/50 hover:text-navy"
                  >
                    Назад
                  </button>
                </form>
              )}

              {step === 'done' && (
                <div className="text-center py-6">
                  <CheckCircle className="w-16 h-16 text-sage mx-auto mb-4" />
                  <h3 className="font-serif text-2xl text-navy mb-2">Записан!</h3>
                  <p className="font-sans text-sm text-navy/60 mb-6">
                    Ще получите потвърждение на имейл {form.email} до 24 часа.
                  </p>
                  <button
                    onClick={() => { setStep('select'); setSelectedSession(null); setSpots(1); }}
                    className="btn-outline w-full text-center"
                  >
                    Нова резервация
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

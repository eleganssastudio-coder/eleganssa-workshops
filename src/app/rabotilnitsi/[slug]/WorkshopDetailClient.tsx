'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users, CheckCircle, ChevronRight, Calendar, Minus, Plus, CreditCard, Banknote } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

type Session = { date: string; startTime: string; endTime: string; spotsLeft: number }

export type WorkshopDetail = {
  _id?: string
  id?: string
  title: string
  slug: string
  description?: string
  shortDescription?: string
  image: string
  price: number
  duration: string
  maxSpots: number
  includes?: string[]
  steps?: string[]
  sessions?: Session[]
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('bg-BG', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function WorkshopDetailClient({ workshop }: { workshop: WorkshopDetail }) {
  const [selectedSession, setSelectedSession] = useState<number | null>(null)
  const [spots, setSpots] = useState(1)
  const [step, setStep] = useState<'select' | 'book' | 'done'>('select')
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card')
  const [bookingId, setBookingId] = useState('')
  const [loading, setLoading] = useState(false)

  const sessions = workshop.sessions || []
  const includes = workshop.includes || []
  const steps = workshop.steps || []
  const session = selectedSession !== null ? sessions[selectedSession] : null
  const toText = (v: any): string => {
    if (!v) return ''
    if (typeof v === 'string') return v
    if (Array.isArray(v)) return v.map((b: any) => b.children?.map((c: any) => c.text || '').join('') || '').join('\n\n')
    return ''
  }
  const description = toText(workshop.description) || toText(workshop.shortDescription)

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const sessionInfo = session
      ? `${formatDate(session.date)}, ${session.startTime}–${session.endTime}`
      : 'По договаряне'

    try {
      const res = await fetch('/api/book-workshop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workshopId: workshop._id,
          workshopTitle: workshop.title,
          sessionIndex: selectedSession,
          sessionInfo,
          spots,
          price: workshop.price,
          name: form.name,
          email: form.email,
          phone: form.phone,
          paymentMethod,
        }),
      })
      const data = await res.json()

      if (paymentMethod === 'card' && data.url) {
        window.location.href = data.url
        return
      }

      setBookingId(data.bookingId || '')
      toast.success('Записването е изпратено! Ще получите потвърждение на имейла.')
      setStep('done')
    } catch (_) {
      toast.error('Грешка. Моля, опитайте отново.')
    } finally {
      setLoading(false)
    }
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
            {description && (
              <div className="mb-12">
                <h2 className="font-serif text-3xl text-navy mb-6">За работилницата</h2>
                <p className="font-sans text-navy/70 leading-relaxed whitespace-pre-line">{description}</p>
              </div>
            )}

            {includes.length > 0 && (
              <div className="mb-12">
                <h2 className="font-serif text-3xl text-navy mb-6">Какво включва</h2>
                <ul className="space-y-4">
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-4">
                      <CheckCircle className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
                      <span className="font-sans text-navy/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {steps.length > 0 && (
              <div className="mb-12">
                <h2 className="font-serif text-3xl text-navy mb-6">Програма</h2>
                <div className="space-y-4">
                  {steps.map((s, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-navy text-cream flex items-center justify-center font-serif text-sm">
                        {i + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-sans text-navy/70">{s}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                    {sessions.length > 0 ? 'Изберете дата и час' : 'Резервация'}
                  </h3>

                  {sessions.length > 0 ? (
                    <div className="space-y-3 mb-6">
                      {sessions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedSession(i)}
                          disabled={s.spotsLeft === 0}
                          className={`w-full text-left p-4 border-2 transition-colors ${
                            selectedSession === i
                              ? 'border-navy bg-navy text-cream'
                              : s.spotsLeft === 0
                              ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                              : 'border-cream bg-white hover:border-navy'
                          }`}
                        >
                          <p className="font-sans text-sm font-medium mb-1">{formatDate(s.date)}</p>
                          <p className="font-sans text-xs">{s.startTime} - {s.endTime}</p>
                          <p className={`font-sans text-xs mt-1 ${selectedSession === i ? 'text-cream/70' : 'text-sage'}`}>
                            {s.spotsLeft === 0 ? 'Няма места' : `${s.spotsLeft} свободни места`}
                          </p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="font-sans text-sm text-navy/60 mb-6">
                      Свържете се с нас за налични дати.
                    </p>
                  )}

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
                      if (sessions.length > 0 && selectedSession === null) {
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

              {step === 'book' && (
                <form onSubmit={handleBook}>
                  <h3 className="font-serif text-xl text-navy mb-4">Вашите данни</h3>
                  {session && (
                    <div className="bg-navy/5 p-3 rounded mb-6 text-sm font-sans">
                      <p className="font-medium text-navy">{formatDate(session.date)}</p>
                      <p className="text-navy/60">{session.startTime} - {session.endTime} · {spots} {spots === 1 ? 'участник' : 'участника'}</p>
                      <p className="font-serif text-navy mt-1">{formatPrice(workshop.price * spots)}</p>
                    </div>
                  )}
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
                  {/* Payment method */}
                  <div className="mb-6">
                    <p className="font-sans text-sm font-medium text-navy mb-3">Начин на плащане на капарото (20 €)</p>
                    <div className="space-y-2">
                      <button type="button" onClick={() => setPaymentMethod('card')}
                        className={`w-full text-left p-4 border-2 flex items-center gap-3 transition-colors ${paymentMethod === 'card' ? 'border-navy bg-navy/5' : 'border-navy/20 hover:border-navy/40'}`}>
                        <CreditCard className={`w-4 h-4 flex-shrink-0 ${paymentMethod === 'card' ? 'text-navy' : 'text-navy/40'}`} />
                        <div>
                          <p className="font-sans text-sm font-medium text-navy">Плащане с карта</p>
                          <p className="font-sans text-xs text-navy/50">Сигурно плащане чрез Stripe</p>
                        </div>
                      </button>
                      <button type="button" onClick={() => setPaymentMethod('bank')}
                        className={`w-full text-left p-4 border-2 flex items-center gap-3 transition-colors ${paymentMethod === 'bank' ? 'border-navy bg-navy/5' : 'border-navy/20 hover:border-navy/40'}`}>
                        <Banknote className={`w-4 h-4 flex-shrink-0 ${paymentMethod === 'bank' ? 'text-navy' : 'text-navy/40'}`} />
                        <div>
                          <p className="font-sans text-sm font-medium text-navy">Банков превод</p>
                          <p className="font-sans text-xs text-navy/50">Ще получите банковите данни по имейл</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full text-center mb-3 disabled:opacity-50">
                    {loading ? 'Обработка...' : paymentMethod === 'card' ? 'Плати капаро 20 € с карта' : 'Запази с банков превод'}
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
                  {bookingId && (
                    <p className="font-sans text-xs text-navy/40 mb-2">Номер: {bookingId}</p>
                  )}
                  <p className="font-sans text-sm text-navy/60 mb-4">
                    Потвърждение ще получите на <strong>{form.email}</strong>.
                  </p>
                  <div className="bg-white p-4 text-left mb-4">
                    <p className="font-sans text-sm font-medium text-navy mb-2">Банков превод — капаро 20 €</p>
                    <div className="font-sans text-xs text-navy/70 space-y-1">
                      <p><span className="text-navy/40">Получател:</span> ELEGANSA EOOD</p>
                      <p><span className="text-navy/40">IBAN:</span> BG17INTF40012092397597</p>
                      <p><span className="text-navy/40">Банка:</span> iCard AD</p>
                      <p><span className="text-navy/40">Основание:</span> {bookingId}</p>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-navy/40 mb-6">
                    Остатъкът от {formatPrice(workshop.price * spots - 20)} се заплаща на място.
                  </p>
                  <button
                    onClick={() => { setStep('select'); setSelectedSession(null); setSpots(1) }}
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

'use client'

import { useState, useEffect } from 'react'
import { MapPin, Mail, Instagram, Clock, Send, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

export default function KontaktiPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<any>(null)

  useEffect(() => {
    fetch('/api/contacts-info').then(r => r.json()).then(setInfo).catch(() => {})
  }, [])

  const address = info?.address ?? 'Варна, ул. Бреза 2'
  const addressLine2 = info?.addressLine2 ?? 'България'
  const email = info?.email ?? 'eleganssastudio@gmail.com'
  const phone = info?.phone ?? ''
  const instagramHandle = info?.instagramHandle ?? 'eleganssastudio'
  const instagramUrl = info?.instagramUrl ?? 'https://www.instagram.com/eleganssastudio/'
  const workingHours: string[] = info?.workingHours ?? ['Вторник - Събота: 10:00 - 18:00', 'Неделя: 10:00 - 14:00', 'Понеделник: Затворено']
  const privateTitle = info?.privateTitle ?? 'Корпоративни и частни поръчки'
  const privateText = info?.privateText ?? 'Организираме частни работилници за рождени дни, моминско парти, корпоративен тийм билдинг и специални поводи. Свържете се с нас за персонализирана оферта.'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, to: email }),
      })
      toast.success('Съобщението е изпратено! Ще се свържем с вас до 24 часа.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      toast.error('Грешка. Моля, опитайте отново.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subtitle">Свържете се с нас</p>
          <h1 className="font-serif text-5xl text-navy">Контакти</h1>
          <div className="w-16 h-px bg-sage mx-auto mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-3xl text-navy mb-8">Намерете ни</h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-10 h-10 border border-sage flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-sage" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-navy mb-1">Адрес</h3>
                  <p className="font-sans text-navy/60 text-sm">{address}</p>
                  {addressLine2 && <p className="font-sans text-navy/60 text-sm">{addressLine2}</p>}
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 border border-sage flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-sage" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-navy mb-1">Имейл</h3>
                  <a href={`mailto:${email}`} className="font-sans text-navy/60 text-sm hover:text-navy transition-colors">
                    {email}
                  </a>
                </div>
              </div>

              {phone && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 border border-sage flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-sage" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-navy mb-1">Телефон</h3>
                    <a href={`tel:${phone}`} className="font-sans text-navy/60 text-sm hover:text-navy transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <div className="w-10 h-10 border border-sage flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-4 h-4 text-sage" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-navy mb-1">Instagram</h3>
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="font-sans text-navy/60 text-sm hover:text-navy transition-colors">
                    @{instagramHandle}
                  </a>
                </div>
              </div>

              {workingHours.length > 0 && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 border border-sage flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-sage" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-navy mb-1">Работно време</h3>
                    {workingHours.map((line: string, i: number) => (
                      <p key={i} className="font-sans text-navy/60 text-sm">{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 bg-cream p-6">
              <h3 className="font-serif text-xl text-navy mb-3">{privateTitle}</h3>
              <p className="font-sans text-navy/60 text-sm leading-relaxed">{privateText}</p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-3xl text-navy mb-8">Изпратете ни съобщение</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-sm text-navy mb-2">Имена *</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy transition-colors"
                    placeholder="Вашите имена"
                  />
                </div>
                <div>
                  <label className="block font-sans text-sm text-navy mb-2">Имейл *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy transition-colors"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block font-sans text-sm text-navy mb-2">Тема</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy transition-colors"
                  placeholder="Как можем да помогнем?"
                />
              </div>
              <div>
                <label className="block font-sans text-sm text-navy mb-2">Съобщение *</label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy transition-colors resize-none"
                  placeholder="Вашето съобщение..."
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                <Send className="w-4 h-4" />
                {loading ? 'Изпращане...' : 'Изпрати съобщение'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

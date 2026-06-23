'use client'

import { useState } from 'react'
import type { Metadata } from 'next'
import { MapPin, Mail, Instagram, Clock, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function KontaktiPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Съобщението е изпратено! Ще се свържем с вас до 24 часа.')
    setForm({ name: '', email: '', subject: '', message: '' })
    setLoading(false)
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
                  <p className="font-sans text-navy/60 text-sm">Варна, ул. Бреза 2</p>
                  <p className="font-sans text-navy/60 text-sm">България</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 border border-sage flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-sage" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-navy mb-1">Имейл</h3>
                  <a
                    href="mailto:eleganssastudio@gmail.com"
                    className="font-sans text-navy/60 text-sm hover:text-navy transition-colors"
                  >
                    eleganssastudio@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 border border-sage flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-4 h-4 text-sage" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-navy mb-1">Instagram</h3>
                  <a
                    href="https://www.instagram.com/eleganssastudio/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-navy/60 text-sm hover:text-navy transition-colors"
                  >
                    @eleganssastudio
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 border border-sage flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-sage" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-navy mb-1">Работно време</h3>
                  <p className="font-sans text-navy/60 text-sm">Вторник - Събота: 10:00 - 18:00</p>
                  <p className="font-sans text-navy/60 text-sm">Неделя: 10:00 - 14:00</p>
                  <p className="font-sans text-navy/60 text-sm">Понеделник: Затворено</p>
                </div>
              </div>
            </div>

            <div className="mt-10 bg-cream p-6">
              <h3 className="font-serif text-xl text-navy mb-3">Корпоративни и частни поръчки</h3>
              <p className="font-sans text-navy/60 text-sm leading-relaxed">
                Организираме частни работилници за рождени дни, моминско парти, корпоративен тийм билдинг и специални поводи. Свържете се с нас за персонализирана оферта.
              </p>
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
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
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

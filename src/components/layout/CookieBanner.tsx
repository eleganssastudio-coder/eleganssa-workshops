'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setVisible(true)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-navy text-cream p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="font-serif text-lg mb-1">Бисквитки</p>
          <p className="text-cream/70 text-sm font-sans">
            Използваме бисквитки, за да подобрим вашето преживяване. Като продължите да използвате сайта, вие се съгласявате с нашата{' '}
            <Link href="/politika-za-poveritelnost" className="text-cream underline hover:text-sage transition-colors">
              Политика за поверителност
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={decline}
            className="px-4 py-2 border border-cream/40 text-cream text-xs tracking-widest uppercase font-sans hover:border-cream transition-colors"
          >
            Откажи
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 bg-sage text-cream text-xs tracking-widest uppercase font-sans hover:bg-cream hover:text-navy transition-colors"
          >
            Приемам
          </button>
        </div>
      </div>
    </div>
  )
}

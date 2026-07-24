'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

function SuccessContent() {
  const params = useSearchParams()
  const bookingId = params.get('booking') || ''
  const session = params.get('session') || ''
  const workshop = params.get('workshop') || ''
  const spots = Number(params.get('spots') || 1)
  const total = Number(params.get('total') || 0)
  const name = params.get('name') || ''
  const email = params.get('email') || ''
  const [notified, setNotified] = useState(false)

  useEffect(() => {
    if (notified || !bookingId) return
    setNotified(true)
    // Notify API to decrease spots and send email (card payment path)
    const workshopId = params.get('workshopId') || ''
    const sessionIndex = params.get('sessionIndex') || '0'
    const phone = params.get('phone') || ''
    fetch(`/api/book-workshop?workshopId=${workshopId}&sessionIndex=${sessionIndex}&spots=${spots}&bookingId=${bookingId}&workshopTitle=${encodeURIComponent(workshop)}&sessionInfo=${encodeURIComponent(session)}&total=${total}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`)
  }, [bookingId])

  return (
    <div className="max-w-lg mx-auto text-center py-20 px-4">
      <CheckCircle className="w-20 h-20 text-sage mx-auto mb-6" />
      <h1 className="font-serif text-4xl text-navy mb-2">Записан!</h1>
      <p className="font-sans text-xs text-navy/40 mb-6">Номер: {bookingId}</p>

      <div className="bg-cream p-6 text-left mb-8">
        <p className="font-serif text-lg text-navy mb-3">{workshop}</p>
        <div className="font-sans text-sm text-navy/70 space-y-1">
          <p><span className="text-navy/40">Дата:</span> {session}</p>
          <p><span className="text-navy/40">Участници:</span> {spots}</p>
          <p><span className="text-navy/40">Платено капаро:</span> 20 €</p>
          <p><span className="text-navy/40">Остатък на място:</span> {formatPrice(total - 20)}</p>
        </div>
      </div>

      <p className="font-sans text-sm text-navy/60 mb-8">
        Потвърждение е изпратено на <strong>{email}</strong>.
      </p>

      <Link href="/rabotilnitsi" className="btn-primary">
        Към работилниците
      </Link>
    </div>
  )
}

export default function WorkshopSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}

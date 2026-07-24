'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Gift } from 'lucide-react'

function VoucherSuccessContent() {
  const params = useSearchParams()
  const code = params.get('code') || ''
  const type = params.get('type') || ''
  const value = params.get('value') || ''
  const recipientName = params.get('recipientName') || ''
  const recipientEmail = params.get('recipientEmail') || ''
  const senderEmail = params.get('senderEmail') || ''
  const [notified, setNotified] = useState(false)

  useEffect(() => {
    if (notified || !code) return
    setNotified(true)
    const sessionId = params.get('session_id') || ''
    fetch(`/api/buy-voucher?code=${code}&session_id=${encodeURIComponent(sessionId)}`)
  }, [code])

  return (
    <div className="max-w-lg mx-auto text-center py-20 px-4">
      <Gift className="w-20 h-20 text-sage mx-auto mb-6" />
      <h1 className="font-serif text-4xl text-navy mb-2">Ваучерът е изпратен!</h1>
      <p className="font-sans text-xs text-navy/40 mb-6">Код: <strong className="text-navy text-sm tracking-widest">{code}</strong></p>

      <div className="bg-cream p-6 text-left mb-8">
        <p className="font-serif text-lg text-navy mb-3">
          {type === 'value' ? `Ваучер на стойност ${value} €` : 'Ваучер за работилница'}
        </p>
        <div className="font-sans text-sm text-navy/70 space-y-1">
          {recipientName && <p><span className="text-navy/40">Получател:</span> {recipientName}</p>}
          {recipientEmail && <p><span className="text-navy/40">Изпратен на:</span> {recipientEmail}</p>}
        </div>
      </div>

      <p className="font-sans text-sm text-navy/60 mb-8">
        Копие е изпратено и на <strong>{senderEmail}</strong>.
      </p>

      <div className="flex flex-col gap-3">
        <Link href="/magazin" className="btn-primary">Към магазина</Link>
        <Link href="/rabotilnitsi" className="btn-outline">Към работилниците</Link>
      </div>
    </div>
  )
}

export default function VoucherSuccessPage() {
  return (
    <Suspense>
      <VoucherSuccessContent />
    </Suspense>
  )
}

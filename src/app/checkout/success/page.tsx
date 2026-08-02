'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { pixelTrack } from '@/lib/metaEvents'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCartStore()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const processed = useRef(false)

  useEffect(() => {
    if (!sessionId || processed.current) return
    processed.current = true

    fetch(`/api/checkout/verify?session_id=${sessionId}`)
      .then(r => r.json())
      .then(async (res) => {
        if (res.error) { setError(res.error); setLoading(false); return }

        setData(res)
        clearCart()
        pixelTrack('Purchase', {
          value: res.amountTotal ? res.amountTotal / 100 : undefined,
          currency: 'EUR',
          content_type: 'product',
        })

        const meta = res.metadata || {}
        const deliveryLabel =
          meta.deliveryType === 'boxnow'
            ? `BoxNow — ${meta.boxnowLockerName}, ${meta.boxnowLockerAddress}, ${meta.boxnowLockerCity}`
            : meta.deliveryType === 'speedy-address'
            ? `Спиди до адрес — ${meta.speedyAddress}`
            : `Спиди до офис — ${meta.speedyLocation}`

        // Send confirmation email
        await fetch('https://formspree.io/f/mpqgnbbd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            _subject: `Нова поръчка (картово плащане) — ${meta.orderNumber}`,
            'Номер на поръчката': meta.orderNumber,
            'Начин на плащане': 'Картово плащане',
            'Доставка': deliveryLabel,
            'Имена': `${meta.firstName} ${meta.lastName}`,
            'Имейл': meta.email,
            'Телефон': meta.phone,
          }),
        }).catch(() => {})

        // Create BoxNow parcel if needed
        if (meta.deliveryType === 'boxnow' && meta.boxnowLockerId) {
          await fetch('/api/boxnow/create-parcel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipientName: `${meta.firstName} ${meta.lastName}`,
              recipientPhone: meta.phone,
              recipientEmail: meta.email,
              lockerId: meta.boxnowLockerId,
              description: `Поръчка ${meta.orderNumber}`,
              codAmount: 0,
            }),
          }).catch(() => {})
        }

        setLoading(false)
      })
      .catch(() => { setError('Грешка при верификация.'); setLoading(false) })
  }, [sessionId, clearCart])

  if (loading) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="font-sans text-navy/60">Проверяване на плащането...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="font-sans text-red-500 mb-4">{error}</p>
        <Link href="/checkout" className="btn-primary">Обратно към поръчката</Link>
      </div>
    )
  }

  const meta = data?.metadata || {}

  return (
    <div className="max-w-lg mx-auto text-center py-12">
      <CheckCircle className="w-20 h-20 text-sage mx-auto mb-6" />
      <h1 className="font-serif text-4xl text-navy mb-4">Поръчката е направена!</h1>
      <p className="font-sans text-navy/60 mb-2">
        Номер на поръчката: <strong className="text-navy">{meta.orderNumber}</strong>
      </p>
      <p className="font-sans text-navy/60 mb-6">
        Плащането е успешно. Потвърждение ще получите на <strong>{meta.email}</strong>.
      </p>

      {meta.deliveryType === 'boxnow' && (
        <div className="bg-cream p-4 mb-4 text-left">
          <p className="font-sans text-sm text-navy/70">
            Доставка чрез <strong>BoxNow</strong> до <strong>{meta.boxnowLockerName}</strong> —{' '}
            {meta.boxnowLockerAddress}, {meta.boxnowLockerCity}. Безплатна доставка.
          </p>
        </div>
      )}
      {meta.deliveryType === 'speedy-office' && (
        <div className="bg-cream p-4 mb-4 text-left">
          <p className="font-sans text-sm text-navy/70">
            Доставка чрез <strong>Спиди</strong> до офис <strong>{meta.speedyLocation}</strong>.
          </p>
        </div>
      )}
      {meta.deliveryType === 'speedy-address' && (
        <div className="bg-cream p-4 mb-4 text-left">
          <p className="font-sans text-sm text-navy/70">
            Доставка чрез <strong>Спиди</strong> до адрес <strong>{meta.speedyAddress}</strong>.
          </p>
        </div>
      )}

      <Link href="/" className="btn-primary">Обратно към началото</Link>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Suspense fallback={<div className="text-center py-20 font-sans text-navy/60">Зареждане...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}

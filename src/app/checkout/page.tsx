'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, CheckCircle, MapPin } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'
import LocationFinderModal from '@/components/ui/LocationFinderModal'
import BoxNowPicker from '@/components/ui/BoxNowPicker'
import type { BoxNowLocker } from '@/lib/boxnow'

type Step = 'shipping' | 'payment' | 'done'
type PaymentMethod = 'stripe' | 'cod'
type DeliveryType = 'boxnow' | 'speedy-office' | 'speedy-address'

function getShippingCost(deliveryType: DeliveryType, paymentMethod: PaymentMethod): number | null {
  if (deliveryType === 'boxnow') return 0
  if (paymentMethod === 'cod') return null
  return deliveryType === 'speedy-address' ? 5 : 2.5
}

async function validateVoucher(code: string): Promise<{ valid: boolean; value?: number; type?: string }> {
  try {
    const res = await fetch(`/api/validate-voucher?code=${encodeURIComponent(code)}`)
    return res.json()
  } catch {
    return { valid: false }
  }
}

const steps = [
  { id: 'shipping', label: 'Доставка' },
  { id: 'payment', label: 'Плащане' },
  { id: 'done', label: 'Потвърждение' },
]

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState<Step>('shipping')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe')
  const [loading, setLoading] = useState(false)
  const [orderNumber] = useState(`ES-${Date.now().toString().slice(-6)}`)
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherDiscount, setVoucherDiscount] = useState(0)
  const [voucherChecking, setVoucherChecking] = useState(false)
  const [voucherMsg, setVoucherMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('boxnow')
  const [boxnowLocker, setBoxnowLocker] = useState<BoxNowLocker | null>(null)
  const [speedyOffice, setSpeedyOffice] = useState('')
  const [speedyAddress, setSpeedyAddress] = useState('')
  const [showBoxNowPicker, setShowBoxNowPicker] = useState(false)
  const [locationModal, setLocationModal] = useState<'speedy' | null>(null)
  const [shippingData, setShippingData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
  })

  const shippingCost = getShippingCost(deliveryType, paymentMethod)
  const total = Math.max(0, totalPrice() + (shippingCost ?? 0) - voucherDiscount)

  const applyVoucher = async () => {
    if (!voucherCode.trim()) return
    setVoucherChecking(true)
    setVoucherMsg(null)
    const result = await validateVoucher(voucherCode.trim().toUpperCase())
    if (result.valid && result.type === 'value' && result.value) {
      setVoucherDiscount(result.value)
      setVoucherMsg({ ok: true, text: `Ваучерът е приложен — отстъпка ${result.value} €` })
    } else {
      setVoucherDiscount(0)
      setVoucherMsg({ ok: false, text: 'Невалиден или вече използван ваучер.' })
    }
    setVoucherChecking(false)
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (deliveryType === 'boxnow' && !boxnowLocker) { toast.error('Моля, изберете BoxNow автомат.'); return }
    if (deliveryType === 'speedy-office' && !speedyOffice.trim()) { toast.error('Моля, изберете офис на Спиди.'); return }
    if (deliveryType === 'speedy-address' && !speedyAddress.trim()) { toast.error('Моля, въведете адрес за доставка.'); return }
    if (deliveryType === 'boxnow') setPaymentMethod('stripe') // COD not available for BoxNow
    setCurrentStep('payment')
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (paymentMethod === 'stripe') {
      try {
        const origin = window.location.origin
        const res = await fetch('/api/checkout/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map(i => ({ name: i.name, variant: i.variant, price: i.price, quantity: i.quantity, image: i.image })),
            shippingCost: shippingCost ?? 0,
            deliveryType,
            boxnowLocker: deliveryType === 'boxnow' ? boxnowLocker : null,
            speedyLocation: deliveryType === 'speedy-office' ? speedyOffice : '',
            speedyAddress: deliveryType === 'speedy-address' ? speedyAddress : '',
            shippingData,
            orderNumber,
            voucherDiscount,
            successUrl: `${origin}/checkout/success`,
            cancelUrl: `${origin}/checkout`,
          }),
        })
        const data = await res.json()
        if (data.url) { window.location.href = data.url; return }
        toast.error(data.error || 'Грешка при Stripe плащане.')
      } catch {
        toast.error('Грешка при свързване с платежния оператор.')
      }
      setLoading(false)
      return
    }

    // COD flow
    const deliveryLabel = deliveryType === 'speedy-office'
      ? `Спиди офис — по тарифа · ${speedyOffice}`
      : `Спиди до адрес — по тарифа · ${speedyAddress}`

    const itemsList = items
      .map(i => `${i.name}${i.variant ? ` (${i.variant})` : ''} × ${i.quantity} = ${formatPrice(i.price * i.quantity)}`)
      .join('\n')

    try {
      await fetch('https://formspree.io/f/mpqgnbbd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `Нова поръчка от магазина — ${orderNumber}`,
          'Номер на поръчката': orderNumber,
          'Начин на плащане': 'Наложен платеж',
          'Продукти': itemsList,
          'Доставка': deliveryLabel,
          ...(voucherDiscount > 0 ? { 'Ваучер': `-${formatPrice(voucherDiscount)}` } : {}),
          'Обща сума': `${formatPrice(total)} + доставка по тарифа`,
          'Имена': `${shippingData.firstName} ${shippingData.lastName}`,
          'Имейл': shippingData.email,
          'Телефон': shippingData.phone,
        }),
      })
    } catch {
      toast.error('Грешка при изпращане. Моля, свържете се с нас.')
    }

    clearCart()
    setCurrentStep('done')
    setLoading(false)
  }

  if (items.length === 0 && currentStep !== 'done') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-4xl text-navy mb-4">Количката е празна</h1>
        <Link href="/magazin" className="btn-primary">Към магазина</Link>
      </div>
    )
  }

  const stepIndex = steps.findIndex(s => s.id === currentStep)

  // Delivery label for order summary
  const deliveryLabel = (() => {
    if (deliveryType === 'boxnow') return 'BoxNow — безплатно'
    const price = shippingCost !== null ? formatPrice(shippingCost) : 'по тарифа'
    return deliveryType === 'speedy-office' ? `Спиди офис — ${price}` : `Спиди до адрес — ${price}`
  })()

  return (
    <>
      {showBoxNowPicker && (
        <BoxNowPicker
          onSelect={(locker) => setBoxnowLocker(locker)}
          onClose={() => setShowBoxNowPicker(false)}
        />
      )}
      {locationModal && (
        <LocationFinderModal
          type={locationModal}
          onClose={() => setLocationModal(null)}
          onManual={(address) => { setSpeedyOffice(address); setLocationModal(null) }}
        />
      )}

      {/* Breadcrumb header */}
      <div className="bg-cream py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-serif text-2xl text-navy tracking-wider lowercase block mb-6">
            eleganssa studio
          </Link>
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 ${currentStep === step.id ? 'text-navy' : 'text-navy/30'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans ${
                    step.id === currentStep ? 'bg-navy text-cream' :
                    i < stepIndex || currentStep === 'done' ? 'bg-sage text-cream' :
                    'border border-navy/20 text-navy/30'
                  }`}>
                    {i < stepIndex || currentStep === 'done' ? <CheckCircle className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="font-sans text-sm">{step.label}</span>
                </div>
                {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-navy/20" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentStep === 'done' ? (
          /* ── CONFIRMATION ── */
          <div className="max-w-lg mx-auto text-center py-12">
            <CheckCircle className="w-20 h-20 text-sage mx-auto mb-6" />
            <h1 className="font-serif text-4xl text-navy mb-4">Поръчката е направена!</h1>
            <p className="font-sans text-navy/60 mb-2">
              Номер на поръчката: <strong className="text-navy">{orderNumber}</strong>
            </p>
            <p className="font-sans text-navy/60 mb-6">
              Ще платите при получаване на пратката. Цената за доставка е по тарифата на Спиди.
            </p>
            {deliveryType === 'speedy-office' && (
              <div className="bg-cream p-4 mb-4 text-left">
                <p className="font-sans text-sm text-navy/70">
                  Доставка чрез <strong>Спиди</strong> до офис <strong>{speedyOffice}</strong>.
                </p>
              </div>
            )}
            {deliveryType === 'speedy-address' && (
              <div className="bg-cream p-4 mb-4 text-left">
                <p className="font-sans text-sm text-navy/70">
                  Доставка чрез <strong>Спиди</strong> до адрес <strong>{speedyAddress}</strong>.
                </p>
              </div>
            )}
            <p className="font-sans text-sm text-navy/50 mb-8">
              Потвърждение ще получите на <strong>{shippingData.email}</strong>.
            </p>
            <Link href="/" className="btn-primary">Обратно към началото</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>

              {/* ── STEP 1: SHIPPING ── */}
              {currentStep === 'shipping' && (
                <form onSubmit={handleShippingSubmit}>
                  <h2 className="font-serif text-2xl text-navy mb-6">Данни на клиента</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Име *</label>
                      <input required type="text" value={shippingData.firstName}
                        onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy" />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Фамилия *</label>
                      <input required type="text" value={shippingData.lastName}
                        onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Имейл *</label>
                      <input required type="email" value={shippingData.email}
                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy" />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Телефон *</label>
                      <input required type="tel" value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy" />
                    </div>
                  </div>

                  <h2 className="font-serif text-2xl text-navy mb-4">Начин на доставка</h2>
                  <div className="border border-navy/15 divide-y divide-navy/10 mb-6">
                    {/* BoxNow */}
                    <label className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-navy/2">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery" checked={deliveryType === 'boxnow'}
                          onChange={() => setDeliveryType('boxnow')}
                          className="w-4 h-4 accent-navy" />
                        <span className="font-sans text-sm text-navy">BoxNow автомат</span>
                      </div>
                      <span className="font-sans text-sm text-sage font-medium">Безплатна доставка</span>
                    </label>

                    {/* Speedy office */}
                    <label className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-navy/2">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery" checked={deliveryType === 'speedy-office'}
                          onChange={() => setDeliveryType('speedy-office')}
                          className="w-4 h-4 accent-navy" />
                        <span className="font-sans text-sm text-navy">Спиди — офис/автомат</span>
                      </div>
                      <span className="font-sans text-sm text-navy">2.50 €</span>
                    </label>

                    {/* Speedy address */}
                    <label className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-navy/2">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="delivery" checked={deliveryType === 'speedy-address'}
                          onChange={() => setDeliveryType('speedy-address')}
                          className="w-4 h-4 accent-navy" />
                        <span className="font-sans text-sm text-navy">Спиди — до адрес</span>
                      </div>
                      <span className="font-sans text-sm text-navy">5.00 €</span>
                    </label>
                  </div>

                  {/* Delivery detail */}
                  {deliveryType === 'boxnow' && (
                    <div className="mb-6">
                      <button type="button" onClick={() => setShowBoxNowPicker(true)}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-left flex items-center justify-between gap-2 hover:border-navy transition-colors">
                        <span className={boxnowLocker ? 'text-navy' : 'text-navy/40'}>
                          {boxnowLocker ? `${boxnowLocker.name} — ${boxnowLocker.address}, ${boxnowLocker.city}` : 'Изберете BoxNow автомат...'}
                        </span>
                        <MapPin className="w-4 h-4 text-navy/40 flex-shrink-0" />
                      </button>
                    </div>
                  )}
                  {deliveryType === 'speedy-office' && (
                    <div className="mb-6">
                      <button type="button" onClick={() => setLocationModal('speedy')}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-left flex items-center justify-between gap-2 hover:border-navy transition-colors">
                        <span className={speedyOffice ? 'text-navy' : 'text-navy/40'}>
                          {speedyOffice || 'Изберете офис на Спиди...'}
                        </span>
                        <MapPin className="w-4 h-4 text-navy/40 flex-shrink-0" />
                      </button>
                    </div>
                  )}
                  {deliveryType === 'speedy-address' && (
                    <div className="mb-6">
                      <input type="text" value={speedyAddress}
                        onChange={(e) => setSpeedyAddress(e.target.value)}
                        placeholder="ул. Примерна 1, гр. София"
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy" />
                    </div>
                  )}

                  <button type="submit" className="btn-primary w-full text-center">
                    Продължи към плащане
                  </button>
                </form>
              )}

              {/* ── STEP 2: PAYMENT ── */}
              {currentStep === 'payment' && (
                <form onSubmit={handlePaymentSubmit}>
                  <h2 className="font-serif text-2xl text-navy mb-6">Начин на плащане</h2>

                  <div className="border border-navy/15 divide-y divide-navy/10 mb-8">
                    <label className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-navy/2">
                      <input type="radio" name="payment" checked={paymentMethod === 'stripe'}
                        onChange={() => setPaymentMethod('stripe')}
                        className="w-4 h-4 accent-navy" />
                      <span className="font-sans text-sm text-navy">С карта</span>
                      <span className="ml-auto flex gap-1 opacity-60">
                        <span className="text-xs border border-navy/20 px-1.5 py-0.5 font-sans">VISA</span>
                        <span className="text-xs border border-navy/20 px-1.5 py-0.5 font-sans">MC</span>
                      </span>
                    </label>

                    {deliveryType !== 'boxnow' && (
                      <label className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-navy/2">
                        <input type="radio" name="payment" checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-4 h-4 accent-navy" />
                        <span className="font-sans text-sm text-navy">Наложен платеж</span>
                        <span className="ml-auto font-sans text-xs text-navy/50">по тарифа</span>
                      </label>
                    )}
                  </div>

                  {/* Voucher */}
                  <div className="mb-8">
                    <p className="font-sans text-sm font-medium text-navy mb-2">Код на ваучер (по избор)</p>
                    <div className="flex gap-2">
                      <input type="text" value={voucherCode}
                        onChange={(e) => { setVoucherCode(e.target.value.toUpperCase()); setVoucherMsg(null); setVoucherDiscount(0) }}
                        placeholder="ELEG-XXXXXXXX"
                        className="flex-1 border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy tracking-widest uppercase" />
                      <button type="button" onClick={applyVoucher}
                        disabled={voucherChecking || !voucherCode.trim()}
                        className="btn-outline px-4 text-sm disabled:opacity-50">
                        {voucherChecking ? '...' : 'Приложи'}
                      </button>
                    </div>
                    {voucherMsg && (
                      <p className={`font-sans text-xs mt-2 ${voucherMsg.ok ? 'text-sage' : 'text-red-500'}`}>
                        {voucherMsg.text}
                      </p>
                    )}
                  </div>

                  <button type="submit" disabled={loading} className="btn-primary w-full text-center mb-3 disabled:opacity-50">
                    {loading
                      ? (paymentMethod === 'stripe' ? 'Пренасочване...' : 'Изпращане...')
                      : paymentMethod === 'stripe'
                      ? `Плати с карта — ${formatPrice(total)}`
                      : `Потвърди поръчката — ${formatPrice(total)} + доставка`}
                  </button>
                  <button type="button" onClick={() => setCurrentStep('shipping')}
                    className="w-full text-center font-sans text-sm text-navy/50 hover:text-navy transition-colors py-2">
                    ← Назад към доставката
                  </button>
                </form>
              )}
            </div>

            {/* ── ORDER SUMMARY ── */}
            <div>
              <div className="bg-cream p-8 sticky top-24">
                <h2 className="font-serif text-2xl text-navy mb-6">Вашата поръчка</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => {
                    const key = item.variant ? `${item.id}-${item.variant}` : item.id
                    return (
                      <div key={key} className="flex gap-4">
                        <div className="relative w-16 h-16 bg-white overflow-hidden flex-shrink-0">
                          {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-navy text-cream text-xs flex items-center justify-center rounded-full">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-navy text-sm">{item.name}</p>
                          {item.variant && <p className="font-sans text-xs text-navy/50">{item.variant}</p>}
                        </div>
                        <span className="font-sans text-sm text-navy whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="border-t border-navy/10 pt-4 space-y-2 mb-4">
                  <div className="flex justify-between font-sans text-sm text-navy">
                    <span>Продукти</span>
                    <span>{formatPrice(totalPrice())}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm text-navy">
                    <span>Доставка</span>
                    <span className={shippingCost === 0 ? 'text-sage' : ''}>{deliveryLabel}</span>
                  </div>
                  {voucherDiscount > 0 && (
                    <div className="flex justify-between font-sans text-sm text-sage">
                      <span>Ваучер</span>
                      <span>-{formatPrice(voucherDiscount)}</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-navy/10 pt-4">
                  <div className="flex justify-between">
                    <span className="font-serif text-xl text-navy">Общо</span>
                    <span className="font-serif text-xl text-navy">
                      {shippingCost === null
                        ? `${formatPrice(total)} + доставка`
                        : formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

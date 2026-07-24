'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, CheckCircle, Banknote, Truck, Package } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

type Step = 'shipping' | 'payment' | 'done'
type PaymentMethod = 'bank' | 'cod'
type DeliveryType = 'boxnow' | 'speedy'

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank')
  const [loading, setLoading] = useState(false)
  const [orderNumber] = useState(`ES-${Date.now().toString().slice(-6)}`)
  const [voucherCode, setVoucherCode] = useState('')
  const [voucherDiscount, setVoucherDiscount] = useState(0)
  const [voucherChecking, setVoucherChecking] = useState(false)
  const [voucherMsg, setVoucherMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('boxnow')
  const [boxnowAddress, setBoxnowAddress] = useState('')
  const [speedyCity, setSpeedyCity] = useState('')
  const [speedyOffice, setSpeedyOffice] = useState('')
  const [shippingData, setShippingData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
  })

  const shipping = deliveryType === 'boxnow' ? 0 : null // BoxNow free; Speedy per tariff
  const total = Math.max(0, totalPrice() + (shipping ?? 0) - voucherDiscount)

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
    setCurrentStep('payment')
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

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
          'Начин на плащане': paymentMethod === 'bank' ? 'Банков превод' : 'Наложен платеж',
          'Продукти': itemsList,
          'Доставка': deliveryType === 'boxnow'
            ? `BoxNow — безплатно · ${boxnowAddress}`
            : `Спиди офис — по тарифа · ${speedyCity}, ${speedyOffice}`,
          ...(voucherDiscount > 0 ? { 'Ваучер': `-${formatPrice(voucherDiscount)}` } : {}),
          'Обща сума': deliveryType === 'speedy' ? `${formatPrice(total)} + доставка Спиди` : formatPrice(total),
          'Имена': `${shippingData.firstName} ${shippingData.lastName}`,
          'Имейл': shippingData.email,
          'Телефон': shippingData.phone,
        }),
      })
    } catch (_) {
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

  return (
    <>
      <div className="bg-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-serif text-2xl text-navy tracking-wider lowercase block mb-8">
            eleganssa studio
          </Link>
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 ${currentStep === step.id ? 'text-navy' : 'text-navy/30'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans ${
                    step.id === currentStep ? 'bg-navy text-cream' :
                    (currentStep === 'payment' && step.id === 'shipping') || currentStep === 'done' ? 'bg-sage text-cream' :
                    'border border-navy/20 text-navy/30'
                  }`}>
                    {(currentStep === 'payment' && step.id === 'shipping') || currentStep === 'done'
                      ? <CheckCircle className="w-4 h-4" />
                      : i + 1}
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
          <div className="max-w-lg mx-auto text-center py-12">
            <CheckCircle className="w-20 h-20 text-sage mx-auto mb-6" />
            <h1 className="font-serif text-4xl text-navy mb-4">Поръчката е направена!</h1>
            <p className="font-sans text-navy/60 mb-2">
              Номер на поръчката: <strong className="text-navy">{orderNumber}</strong>
            </p>
            {paymentMethod === 'bank' ? (
              <div className="bg-cream p-6 text-left mb-6">
                <p className="font-serif text-lg text-navy mb-3">Банков превод</p>
                <p className="font-sans text-sm text-navy/70 mb-1">Моля, наредете <strong>{formatPrice(total)}</strong> по следните данни:</p>
                <div className="font-sans text-sm text-navy/80 space-y-1 mt-3">
                  <p><span className="text-navy/40">Получател:</span> ELEGANSA EOOD</p>
                  <p><span className="text-navy/40">IBAN:</span> BG17INTF40012092397597</p>
                  <p><span className="text-navy/40">Банка:</span> iCard AD (INTFBGSF)</p>
                  <p><span className="text-navy/40">Основание:</span> Поръчка {orderNumber}</p>
                </div>
                <p className="font-sans text-xs text-navy/40 mt-3">Поръчката се обработва след получаване на плащането.</p>
              </div>
            ) : (
              <p className="font-sans text-navy/60 mb-6">
                Ще платите <strong>{formatPrice(total)}</strong> при получаване на пратката.
              </p>
            )}
            {deliveryType === 'speedy' && (
              <div className="bg-cream p-4 mb-4 text-left">
                <p className="font-sans text-sm text-navy/70">
                  Доставка чрез <strong>Спиди</strong> до офис <strong>{speedyOffice}, {speedyCity}</strong>. Цената за доставка ще ви бъде съобщена допълнително.
                </p>
              </div>
            )}
            {deliveryType === 'boxnow' && (
              <div className="bg-cream p-4 mb-4 text-left">
                <p className="font-sans text-sm text-navy/70">
                  Доставка чрез <strong>BoxNow</strong> до автомат: <strong>{boxnowAddress}</strong>. Безплатна доставка.
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
              {currentStep === 'shipping' && (
                <form onSubmit={handleShippingSubmit}>
                  <h2 className="font-serif text-2xl text-navy mb-6">Вашите данни</h2>
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
                  <div className="grid grid-cols-2 gap-4 mb-8">
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

                  {/* Delivery */}
                  <h2 className="font-serif text-2xl text-navy mb-4">Начин на доставка</h2>
                  <div className="space-y-3 mb-4">
                    <button type="button" onClick={() => setDeliveryType('boxnow')}
                      className={`w-full text-left p-5 border-2 flex items-start gap-4 transition-colors ${deliveryType === 'boxnow' ? 'border-navy bg-navy/5' : 'border-navy/20 hover:border-navy/40'}`}>
                      <Package className={`w-5 h-5 mt-0.5 flex-shrink-0 ${deliveryType === 'boxnow' ? 'text-navy' : 'text-navy/40'}`} />
                      <div>
                        <p className="font-sans font-medium text-navy text-sm">BoxNow автомат — Безплатно</p>
                        <p className="font-sans text-xs text-navy/50 mt-0.5">Получавате пратката от BoxNow автомат по ваш избор.</p>
                      </div>
                    </button>
                    <button type="button" onClick={() => setDeliveryType('speedy')}
                      className={`w-full text-left p-5 border-2 flex items-start gap-4 transition-colors ${deliveryType === 'speedy' ? 'border-navy bg-navy/5' : 'border-navy/20 hover:border-navy/40'}`}>
                      <Truck className={`w-5 h-5 mt-0.5 flex-shrink-0 ${deliveryType === 'speedy' ? 'text-navy' : 'text-navy/40'}`} />
                      <div>
                        <p className="font-sans font-medium text-navy text-sm">Спиди — офис по избор</p>
                        <p className="font-sans text-xs text-navy/50 mt-0.5">Цената е по тарифата на Спиди и ще бъде потвърдена след поръчката.</p>
                      </div>
                    </button>
                  </div>

                  {deliveryType === 'boxnow' && (
                    <div className="mb-8">
                      <label className="block font-sans text-sm text-navy mb-2">Адрес на BoxNow автомат *</label>
                      <input required type="text" value={boxnowAddress}
                        onChange={(e) => setBoxnowAddress(e.target.value)}
                        placeholder="напр. BoxNow — Mall of Sofia, ет. 0"
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy" />
                      <p className="font-sans text-xs text-navy/40 mt-2">
                        Намерете автомат на{' '}
                        <a href="https://boxnow.bg/bg/locations" target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">boxnow.bg/bg/locations</a>
                      </p>
                    </div>
                  )}

                  {deliveryType === 'speedy' && (
                    <div className="mb-8 space-y-4">
                      <div>
                        <label className="block font-sans text-sm text-navy mb-2">Град *</label>
                        <input required type="text" value={speedyCity}
                          onChange={(e) => setSpeedyCity(e.target.value)}
                          placeholder="напр. София"
                          className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy" />
                      </div>
                      <div>
                        <label className="block font-sans text-sm text-navy mb-2">Офис на Спиди *</label>
                        <input required type="text" value={speedyOffice}
                          onChange={(e) => setSpeedyOffice(e.target.value)}
                          placeholder="напр. Спиди — бул. Витоша 10"
                          className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy" />
                        <p className="font-sans text-xs text-navy/40 mt-2">
                          Намерете офис на{' '}
                          <a href="https://www.speedy.bg/bg/offices-and-sps/" target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">speedy.bg</a>
                        </p>
                      </div>
                    </div>
                  )}

                  <button type="submit" className="btn-primary w-full text-center">
                    Продължи към плащане
                  </button>
                </form>
              )}

              {currentStep === 'payment' && (
                <form onSubmit={handlePaymentSubmit}>
                  <h2 className="font-serif text-2xl text-navy mb-6">Начин на плащане</h2>

                  <div className="space-y-3 mb-8">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank')}
                      className={`w-full text-left p-5 border-2 transition-colors flex items-start gap-4 ${
                        paymentMethod === 'bank' ? 'border-navy bg-navy/5' : 'border-navy/20 hover:border-navy/40'
                      }`}
                    >
                      <Banknote className={`w-5 h-5 mt-0.5 flex-shrink-0 ${paymentMethod === 'bank' ? 'text-navy' : 'text-navy/40'}`} />
                      <div>
                        <p className="font-sans font-medium text-navy text-sm">Банков превод</p>
                        <p className="font-sans text-xs text-navy/50 mt-1">
                          Получавате банковите данни след потвърждение. Поръчката се обработва след получаване на плащането.
                        </p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full text-left p-5 border-2 transition-colors flex items-start gap-4 ${
                        paymentMethod === 'cod' ? 'border-navy bg-navy/5' : 'border-navy/20 hover:border-navy/40'
                      }`}
                    >
                      <Truck className={`w-5 h-5 mt-0.5 flex-shrink-0 ${paymentMethod === 'cod' ? 'text-navy' : 'text-navy/40'}`} />
                      <div>
                        <p className="font-sans font-medium text-navy text-sm">Наложен платеж</p>
                        <p className="font-sans text-xs text-navy/50 mt-1">
                          Плащате в брой при получаване на пратката от куриера.
                        </p>
                      </div>
                    </button>
                  </div>

                  {/* Voucher code */}
                  <div className="mb-6">
                    <p className="font-sans text-sm font-medium text-navy mb-3">Код на ваучер (по избор)</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={voucherCode}
                        onChange={(e) => { setVoucherCode(e.target.value.toUpperCase()); setVoucherMsg(null); setVoucherDiscount(0) }}
                        placeholder="ELEG-XXXXXXXX"
                        className="flex-1 border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy tracking-widest uppercase"
                      />
                      <button
                        type="button"
                        onClick={applyVoucher}
                        disabled={voucherChecking || !voucherCode.trim()}
                        className="btn-outline px-4 text-sm disabled:opacity-50"
                      >
                        {voucherChecking ? '...' : 'Приложи'}
                      </button>
                    </div>
                    {voucherMsg && (
                      <p className={`font-sans text-xs mt-2 ${voucherMsg.ok ? 'text-sage' : 'text-red-500'}`}>
                        {voucherMsg.text}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setCurrentStep('shipping')} className="btn-outline">
                      Назад
                    </button>
                    <button type="submit" disabled={loading} className="btn-primary flex-1 text-center disabled:opacity-50">
                      {loading ? 'Изпращане...' : `Потвърди поръчката — ${formatPrice(total)}`}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Order Summary */}
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
                        <div className="flex-1">
                          <p className="font-serif text-navy text-sm">{item.name}</p>
                          {item.variant && <p className="font-sans text-xs text-navy/50">{item.variant}</p>}
                        </div>
                        <span className="font-sans text-sm text-navy">{formatPrice(item.price * item.quantity)}</span>
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
                    <span>{deliveryType === 'boxnow' ? 'BoxNow — безплатно' : 'Спиди — по тарифа'}</span>
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
                    <span className="font-serif text-xl text-navy">{formatPrice(total)}</span>
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

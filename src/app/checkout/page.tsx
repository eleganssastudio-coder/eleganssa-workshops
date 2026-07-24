'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, CheckCircle, Banknote, Truck } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

type Step = 'shipping' | 'payment' | 'done'
type PaymentMethod = 'bank' | 'cod'

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
  const [shippingData, setShippingData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    street: '', city: '', postalCode: '',
  })

  const shipping = totalPrice() >= 100 ? 0 : 7
  const total = totalPrice() + shipping

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
          'Доставка': shipping === 0 ? 'Безплатна' : formatPrice(shipping),
          'Обща сума': formatPrice(total),
          'Имена': `${shippingData.firstName} ${shippingData.lastName}`,
          'Имейл': shippingData.email,
          'Телефон': shippingData.phone,
          'Адрес': `${shippingData.street}, ${shippingData.postalCode} ${shippingData.city}`,
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
            <p className="font-sans text-sm text-navy/50 mb-8">
              Потвърждение ще получите на <strong>{shippingData.email}</strong>. Очаквайте доставка в рамките на 3–5 работни дни.
            </p>
            <Link href="/" className="btn-primary">Обратно към началото</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              {currentStep === 'shipping' && (
                <form onSubmit={handleShippingSubmit}>
                  <h2 className="font-serif text-2xl text-navy mb-6">Данни за доставка</h2>
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
                  <div className="grid grid-cols-2 gap-4 mb-4">
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
                  <div className="mb-4">
                    <label className="block font-sans text-sm text-navy mb-2">Адрес *</label>
                    <input required type="text" value={shippingData.street}
                      onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                      className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Град *</label>
                      <input required type="text" value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy" />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Пощенски код *</label>
                      <input required type="text" value={shippingData.postalCode}
                        onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy" />
                    </div>
                  </div>
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
                    <span>{shipping === 0 ? 'Безплатна' : formatPrice(shipping)}</span>
                  </div>
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

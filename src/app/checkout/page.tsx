'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, CheckCircle, Lock } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

type Step = 'shipping' | 'payment' | 'done'

const steps = [
  { id: 'shipping', label: 'Доставка' },
  { id: 'payment', label: 'Плащане' },
  { id: 'done', label: 'Потвърждение' },
]

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const [currentStep, setCurrentStep] = useState<Step>('shipping')
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [orderNumber] = useState(`ES-${Date.now().toString().slice(-6)}`)

  const shipping = totalPrice() >= 100 ? 0 : 7
  const total = totalPrice() + shipping

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep('payment')
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
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
          {/* Progress */}
          <div className="flex items-center gap-2">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 ${
                  currentStep === step.id
                    ? 'text-navy'
                    : steps.indexOf({ id: currentStep, label: '' } as typeof step) > i
                    ? 'text-sage'
                    : 'text-navy/30'
                }`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-sans ${
                    step.id === currentStep ? 'bg-navy text-cream' :
                    (currentStep === 'payment' && step.id === 'shipping') || currentStep === 'done' ? 'bg-sage text-cream' :
                    'border border-navy/20 text-navy/30'
                  }`}>
                    {(currentStep === 'payment' && step.id === 'shipping') || currentStep === 'done' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="font-sans text-sm">{step.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-navy/20" />
                )}
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
            <p className="font-sans text-navy/60 mb-8">
              Ще получите потвърждение на имейл адреса си. Очаквайте доставката в рамките на 3-5 работни дни.
            </p>
            <Link href="/" className="btn-primary">
              Обратно към началото
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              {currentStep === 'shipping' && (
                <form onSubmit={handleShippingSubmit}>
                  <h2 className="font-serif text-2xl text-navy mb-6">Данни за доставка</h2>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Име *</label>
                      <input
                        required
                        type="text"
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Фамилия *</label>
                      <input
                        required
                        type="text"
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Имейл *</label>
                      <input
                        required
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Телефон *</label>
                      <input
                        required
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block font-sans text-sm text-navy mb-2">Адрес *</label>
                    <input
                      required
                      type="text"
                      value={shippingData.street}
                      onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                      className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Град *</label>
                      <input
                        required
                        type="text"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Пощенски код *</label>
                      <input
                        required
                        type="text"
                        value={shippingData.postalCode}
                        onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary w-full text-center">
                    Продължи към плащане
                  </button>
                </form>
              )}

              {currentStep === 'payment' && (
                <form onSubmit={handlePaymentSubmit}>
                  <h2 className="font-serif text-2xl text-navy mb-2">Плащане</h2>
                  <div className="flex items-center gap-2 mb-6">
                    <Lock className="w-4 h-4 text-sage" />
                    <p className="font-sans text-sm text-navy/50">Сигурно плащане чрез Stripe</p>
                  </div>
                  <div className="mb-4">
                    <label className="block font-sans text-sm text-navy mb-2">Номер на картата *</label>
                    <input
                      required
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Валидна до *</label>
                      <input
                        required
                        type="text"
                        placeholder="MM/ГГ"
                        maxLength={5}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">CVV *</label>
                      <input
                        required
                        type="text"
                        placeholder="123"
                        maxLength={4}
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('shipping')}
                      className="btn-outline"
                    >
                      Назад
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 text-center disabled:opacity-50"
                    >
                      {loading ? 'Обработка...' : `Плати ${formatPrice(total)}`}
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
                          {item.image && (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          )}
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-navy text-cream text-xs flex items-center justify-center rounded-full">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="font-serif text-navy text-sm">{item.name}</p>
                          {item.variant && (
                            <p className="font-sans text-xs text-navy/50">{item.variant}</p>
                          )}
                        </div>
                        <span className="font-sans text-sm text-navy">
                          {formatPrice(item.price * item.quantity)}
                        </span>
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

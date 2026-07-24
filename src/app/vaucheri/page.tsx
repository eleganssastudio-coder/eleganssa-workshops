'use client'

import { useState } from 'react'
import { Gift, Mail, Store, Package } from 'lucide-react'
import toast from 'react-hot-toast'

type VoucherType = 'workshop' | 'value'
type DeliveryMethod = 'digital' | 'atelier' | 'boxnow'

const valueOptions = [25, 50, 75, 100, 150]

const WORKSHOP_PRICE = 39

export default function VouchersPage() {
  const [voucherType, setVoucherType] = useState<VoucherType>('value')
  const [selectedValue, setSelectedValue] = useState<number>(50)
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('digital')
  const [boxnowAddress, setBoxnowAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    senderName: '',
    senderEmail: '',
    recipientName: '',
    recipientEmail: '',
    message: '',
  })

  const voucherPrice = voucherType === 'workshop' ? WORKSHOP_PRICE : selectedValue
  const deliveryPrice = deliveryMethod === 'boxnow' ? 0 : 0 // BoxNow free, atelier free, digital free
  const totalPrice = voucherPrice + deliveryPrice

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (deliveryMethod === 'boxnow' && !boxnowAddress.trim()) {
      toast.error('Моля, въведете адрес на BoxNow автомат.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/buy-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherType,
          value: voucherType === 'value' ? selectedValue : WORKSHOP_PRICE,
          deliveryMethod,
          boxnowAddress: deliveryMethod === 'boxnow' ? boxnowAddress : '',
          ...form,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Грешка. Моля, опитайте отново.')
      }
    } catch {
      toast.error('Грешка. Моля, опитайте отново.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <Gift className="w-12 h-12 text-sage mx-auto mb-4" />
        <h1 className="font-serif text-5xl text-navy mb-4">Подаръчен ваучер</h1>
        <p className="font-sans text-navy/60">
          Подарете незабравимо преживяване или свобода на избор.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Type selector */}
        <div className="mb-8">
          <p className="font-serif text-xl text-navy mb-4">Вид ваучер</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setVoucherType('value')}
              className={`p-6 border-2 text-left transition-colors ${voucherType === 'value' ? 'border-navy bg-navy/5' : 'border-navy/20 hover:border-navy/40'}`}
            >
              <p className="font-serif text-lg text-navy mb-1">На стойност</p>
              <p className="font-sans text-xs text-navy/50">За покупки от магазина</p>
            </button>
            <button
              type="button"
              onClick={() => setVoucherType('workshop')}
              className={`p-6 border-2 text-left transition-colors ${voucherType === 'workshop' ? 'border-navy bg-navy/5' : 'border-navy/20 hover:border-navy/40'}`}
            >
              <p className="font-serif text-lg text-navy mb-1">За работилница</p>
              <p className="font-sans text-xs text-navy/50">Участие в работилница — 39 €</p>
            </button>
          </div>
        </div>

        {/* Value selector */}
        {voucherType === 'value' && (
          <div className="mb-8">
            <p className="font-serif text-xl text-navy mb-4">Стойност</p>
            <div className="flex flex-wrap gap-3">
              {valueOptions.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setSelectedValue(v)}
                  className={`px-6 py-3 border-2 font-sans text-sm font-medium transition-colors ${
                    selectedValue === v ? 'border-navy bg-navy text-cream' : 'border-navy/20 text-navy hover:border-navy'
                  }`}
                >
                  {v} €
                </button>
              ))}
            </div>
          </div>
        )}

        {voucherType === 'workshop' && (
          <div className="mb-8 bg-cream p-6">
            <p className="font-sans text-sm text-navy/70">
              Ваучерът дава право на участие в работилница по избор на получателя. Цената включва всички материали и инструкции.
            </p>
          </div>
        )}

        {/* Delivery method */}
        <div className="mb-8">
          <p className="font-serif text-xl text-navy mb-4">Формат на ваучера</p>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setDeliveryMethod('digital')}
              className={`w-full text-left p-5 border-2 flex items-start gap-4 transition-colors ${deliveryMethod === 'digital' ? 'border-navy bg-navy/5' : 'border-navy/20 hover:border-navy/40'}`}
            >
              <Mail className={`w-5 h-5 mt-0.5 flex-shrink-0 ${deliveryMethod === 'digital' ? 'text-navy' : 'text-navy/40'}`} />
              <div>
                <p className="font-sans font-medium text-navy text-sm">Дигитален — по имейл</p>
                <p className="font-sans text-xs text-navy/50 mt-0.5">Ваучерът се изпраща незабавно на имейла на получателя. Безплатно.</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryMethod('atelier')}
              className={`w-full text-left p-5 border-2 flex items-start gap-4 transition-colors ${deliveryMethod === 'atelier' ? 'border-navy bg-navy/5' : 'border-navy/20 hover:border-navy/40'}`}
            >
              <Store className={`w-5 h-5 mt-0.5 flex-shrink-0 ${deliveryMethod === 'atelier' ? 'text-navy' : 'text-navy/40'}`} />
              <div>
                <p className="font-sans font-medium text-navy text-sm">Физическа картичка — от ателието</p>
                <p className="font-sans text-xs text-navy/50 mt-0.5">Красива картичка в плик, която получавате лично от нас. Свържете се с нас за ден и час.</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryMethod('boxnow')}
              className={`w-full text-left p-5 border-2 flex items-start gap-4 transition-colors ${deliveryMethod === 'boxnow' ? 'border-navy bg-navy/5' : 'border-navy/20 hover:border-navy/40'}`}
            >
              <Package className={`w-5 h-5 mt-0.5 flex-shrink-0 ${deliveryMethod === 'boxnow' ? 'text-navy' : 'text-navy/40'}`} />
              <div>
                <p className="font-sans font-medium text-navy text-sm">Физическа картичка — BoxNow автомат</p>
                <p className="font-sans text-xs text-navy/50 mt-0.5">Доставка до BoxNow автомат по ваш избор. Безплатно.</p>
              </div>
            </button>
          </div>

          {deliveryMethod === 'atelier' && (
            <div className="mt-4 bg-cream p-4">
              <p className="font-sans text-sm text-navy/70">
                След завършване на поръчката се свържете с нас на <strong>eleganssastudio@gmail.com</strong> или чрез формата за контакт, за да уговорим удобен ден и час за получаване.
              </p>
            </div>
          )}

          {deliveryMethod === 'boxnow' && (
            <div className="mt-4">
              <label className="block font-sans text-sm text-navy mb-2">
                Адрес или наименование на BoxNow автомат *
              </label>
              <input
                type="text"
                value={boxnowAddress}
                onChange={(e) => setBoxnowAddress(e.target.value)}
                placeholder="напр. BoxNow — Mall of Sofia, ет. 0"
                className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
              />
              <p className="font-sans text-xs text-navy/40 mt-2">
                Намерете автомат на{' '}
                <a href="https://boxnow.bg/bg/locations" target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">
                  boxnow.bg/bg/locations
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Sender info */}
        <div className="mb-8">
          <p className="font-serif text-xl text-navy mb-4">Вашите данни</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-sans text-sm text-navy mb-2">Вашите имена *</label>
              <input
                required
                type="text"
                value={form.senderName}
                onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block font-sans text-sm text-navy mb-2">Вашият имейл *</label>
              <input
                required
                type="email"
                value={form.senderEmail}
                onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
                className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
              />
            </div>
          </div>
        </div>

        {/* Recipient info */}
        <div className="mb-8">
          <p className="font-serif text-xl text-navy mb-4">Данни на получателя</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-sans text-sm text-navy mb-2">Имена на получателя *</label>
              <input
                required
                type="text"
                value={form.recipientName}
                onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block font-sans text-sm text-navy mb-2">Имейл на получателя *</label>
              <input
                required
                type="email"
                value={form.recipientEmail}
                onChange={(e) => setForm({ ...form, recipientEmail: e.target.value })}
                className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
              />
            </div>
          </div>
          <div>
            <label className="block font-sans text-sm text-navy mb-2">Послание (по избор)</label>
            <textarea
              rows={3}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Напишете лично послание към получателя..."
              className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy resize-none"
            />
          </div>
        </div>

        {/* Summary */}
        <div className="bg-cream p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-serif text-lg text-navy">
                {voucherType === 'value' ? `Ваучер ${selectedValue} €` : 'Ваучер за работилница'}
              </p>
              <p className="font-sans text-xs text-navy/50 mt-1">
                {deliveryMethod === 'digital' && 'Дигитален — по имейл'}
                {deliveryMethod === 'atelier' && 'Физическа картичка — от ателието'}
                {deliveryMethod === 'boxnow' && 'Физическа картичка — BoxNow'}
              </p>
              {form.recipientEmail && (
                <p className="font-sans text-xs text-navy/40 mt-1">
                  За: {form.recipientName || form.recipientEmail}
                </p>
              )}
            </div>
            <p className="font-serif text-2xl text-navy">{totalPrice} €</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-center disabled:opacity-50"
        >
          {loading ? 'Пренасочване...' : `Плати ${totalPrice} € с карта`}
        </button>
      </form>
    </div>
  )
}

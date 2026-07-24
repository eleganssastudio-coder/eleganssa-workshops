'use client'

import { useState } from 'react'
import { Gift, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

type VoucherType = 'workshop' | 'value'

const valueOptions = [25, 50, 75, 100, 150]

export default function VouchersPage() {
  const [voucherType, setVoucherType] = useState<VoucherType>('value')
  const [selectedValue, setSelectedValue] = useState<number>(50)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    senderName: '',
    senderEmail: '',
    recipientName: '',
    recipientEmail: '',
    message: '',
  })

  const price = voucherType === 'workshop' ? 0 : selectedValue

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/buy-voucher', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voucherType,
          value: voucherType === 'value' ? selectedValue : null,
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
              <p className="font-sans text-xs text-navy/50">За работилница по избор</p>
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
              Ваучерът дава право на участие в работилница по избор на получателя. Цената се определя от избраната работилница и ще бъде посочена при плащането.
            </p>
          </div>
        )}

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
          <div className="flex justify-between items-center">
            <div>
              <p className="font-serif text-lg text-navy">
                {voucherType === 'value' ? `Ваучер ${selectedValue} €` : 'Ваучер за работилница'}
              </p>
              <p className="font-sans text-xs text-navy/50 mt-1">
                Кодът ще бъде изпратен на {form.recipientEmail || 'имейла на получателя'}
              </p>
            </div>
            {voucherType === 'value' && (
              <p className="font-serif text-2xl text-navy">{selectedValue} €</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-center disabled:opacity-50"
        >
          {loading ? 'Пренасочване...' : voucherType === 'value' ? `Плати ${selectedValue} € с карта` : 'Избери работилница и плати'}
        </button>
      </form>
    </div>
  )
}

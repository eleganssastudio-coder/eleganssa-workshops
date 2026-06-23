'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export default function KoshtoritsaPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore()

  const shipping = totalPrice() >= 100 ? 0 : 7
  const total = totalPrice() + shipping

  return (
    <>
      <div className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-5xl text-navy">Количка</h1>
          <div className="w-16 h-px bg-sage mx-auto mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-20 h-20 text-cream mx-auto mb-6" />
            <h2 className="font-serif text-3xl text-navy mb-3">Количката е празна</h2>
            <p className="font-sans text-navy/50 mb-8">
              Разгледайте нашите продукти и добавете нещо красиво
            </p>
            <Link href="/magazin" className="btn-primary">
              Към магазина
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl text-navy">
                  {items.length} {items.length === 1 ? 'продукт' : 'продукта'}
                </h2>
                <button
                  onClick={clearCart}
                  className="font-sans text-sm text-navy/40 hover:text-terracotta transition-colors"
                >
                  Изчисти количката
                </button>
              </div>

              <div className="divide-y divide-cream">
                {items.map((item) => {
                  const key = item.variant ? `${item.id}-${item.variant}` : item.id
                  return (
                    <div key={key} className="py-6 flex gap-6">
                      <div className="relative w-24 h-24 flex-shrink-0 bg-cream overflow-hidden">
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-serif text-lg text-navy">{item.name}</h3>
                            {item.variant && (
                              <p className="font-sans text-sm text-navy/50">{item.variant}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id, item.variant)}
                            className="text-navy/30 hover:text-terracotta transition-colors ml-4"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-cream">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors"
                            >
                              <Minus className="w-3 h-3 text-navy" />
                            </button>
                            <span className="w-10 text-center font-sans text-sm text-navy">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-cream transition-colors"
                            >
                              <Plus className="w-3 h-3 text-navy" />
                            </button>
                          </div>
                          <span className="font-serif text-xl text-navy">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Link
                href="/magazin"
                className="flex items-center gap-2 font-sans text-sm text-navy/50 hover:text-navy transition-colors mt-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Продължи пазаруването
              </Link>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-cream p-8 sticky top-24">
                <h2 className="font-serif text-2xl text-navy mb-6">Обобщение</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-sans text-sm text-navy">
                    <span>Продукти</span>
                    <span>{formatPrice(totalPrice())}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm text-navy">
                    <span>Доставка</span>
                    <span>{shipping === 0 ? 'Безплатна' : formatPrice(shipping)}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="font-sans text-xs text-sage">
                      Безплатна доставка при поръчки над {formatPrice(100)}
                    </p>
                  )}
                </div>
                <div className="border-t border-navy/10 pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-serif text-xl text-navy">Общо</span>
                    <span className="font-serif text-xl text-navy">{formatPrice(total)}</span>
                  </div>
                  <p className="font-sans text-xs text-navy/40 mt-1">Включен ДДС</p>
                </div>

                {/* Promo code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Промо код"
                      className="flex-1 border border-navy/20 px-3 py-2 font-sans text-sm text-navy bg-white focus:outline-none focus:border-navy"
                    />
                    <button className="px-4 py-2 border border-navy text-navy font-sans text-sm hover:bg-navy hover:text-cream transition-colors">
                      OK
                    </button>
                  </div>
                </div>

                <Link href="/checkout" className="btn-primary w-full text-center block mb-3">
                  Продължи към поръчката
                </Link>
                <p className="text-center font-sans text-xs text-navy/40">
                  Сигурно плащане с Stripe
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

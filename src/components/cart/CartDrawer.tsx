'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCartStore()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy/50 z-40 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-light-cream z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-cream">
          <h2 className="font-serif text-2xl text-navy">Количка</h2>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-cream rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-navy" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-cream mb-4" />
              <p className="font-serif text-xl text-navy mb-2">Количката е празна</p>
              <p className="text-navy/60 text-sm font-sans mb-6">
                Разгледайте нашите продукти и добавете нещо красиво
              </p>
              <button onClick={closeCart} className="btn-primary">
                Към магазина
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => {
                const key = item.variant ? `${item.id}-${item.variant}` : item.id
                return (
                  <div key={key} className="flex gap-4">
                    <div className="relative w-20 h-20 flex-shrink-0 bg-cream overflow-hidden">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-navy text-sm mb-1">{item.name}</h4>
                      {item.variant && (
                        <p className="text-navy/50 text-xs font-sans mb-2">{item.variant}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-cream">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-cream transition-colors"
                          >
                            <Minus className="w-3 h-3 text-navy" />
                          </button>
                          <span className="w-8 text-center text-sm font-sans text-navy">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-cream transition-colors"
                          >
                            <Plus className="w-3 h-3 text-navy" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-sans text-navy text-sm font-medium">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id, item.variant)}
                            className="text-navy/40 hover:text-terracotta transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-cream bg-white">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-navy/70 text-sm">Междинна сума</span>
              <span className="font-serif text-navy text-xl">{formatPrice(totalPrice())}</span>
            </div>
            <p className="text-navy/50 text-xs font-sans mb-4">
              Транспортните разходи се изчисляват при checkout
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full text-center block"
            >
              Продължи към поръчката
            </Link>
            <Link
              href="/koshnitsa"
              onClick={closeCart}
              className="btn-outline w-full text-center block mt-3"
            >
              Виж количката
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

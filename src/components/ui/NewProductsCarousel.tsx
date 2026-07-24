'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

type Product = {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string[]
  inStock: boolean
  category?: { name: string; slug: string }
}

export default function NewProductsCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const addItem = useCartStore((s) => s.addItem)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.75
    scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  if (!products.length) return null

  return (
    <section className="py-16 bg-white overflow-hidden">
      {/* Header */}
      <div className="flex items-end justify-between mb-8 px-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-4xl md:text-5xl text-navy tracking-tight">НОВО</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => scroll('left')}
            className="w-10 h-10 border border-navy/20 flex items-center justify-center hover:border-navy hover:bg-navy hover:text-cream transition-colors text-navy"
            aria-label="Назад"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-10 h-10 border border-navy/20 flex items-center justify-center hover:border-navy hover:bg-navy hover:text-cream transition-colors text-navy"
            aria-label="Напред"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Scrollable row — full width */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth pb-4 px-4 sm:px-6 lg:px-8"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-56 md:w-64 group flex flex-col">
            {/* Image */}
            <Link href={`/magazin/${product.slug}`} className="block relative aspect-square bg-cream overflow-hidden mb-3">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-cream" />
              )}
              <span className="absolute top-3 left-3 bg-navy text-cream font-sans text-xs px-2.5 py-1">
                Ново
              </span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="absolute top-3 right-3 bg-terracotta text-cream font-sans text-xs px-2.5 py-1">
                  ПРОМО
                </span>
              )}
            </Link>

            {/* Info */}
            <div className="flex flex-col flex-1">
              {product.category && (
                <p className="font-sans text-xs text-navy/40 uppercase tracking-wider mb-1">
                  {product.category.name}
                </p>
              )}
              <Link href={`/magazin/${product.slug}`}>
                <p className="font-sans text-sm text-navy font-medium leading-snug mb-2 line-clamp-2 group-hover:text-sage transition-colors">
                  {product.name}
                </p>
              </Link>
              <div className="flex items-center gap-2 mb-3 mt-auto">
                <span className="font-serif text-base text-navy">{formatPrice(product.price)}</span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="font-sans text-xs text-navy/40 line-through">{formatPrice(product.comparePrice)}</span>
                )}
              </div>
              <button
                onClick={() => {
                  if (!product.inStock) return
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0] || '',
                    quantity: 1,
                  })
                  toast.success('Добавено в количката')
                }}
                disabled={!product.inStock}
                className="w-full border border-navy text-navy font-sans text-xs py-2.5 hover:bg-navy hover:text-cream transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {product.inStock ? 'Добави в количката' : 'Изчерпан'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right mt-6 px-4 sm:px-6 lg:px-8">
        <Link href="/magazin" className="font-sans text-sm text-navy/60 hover:text-navy transition-colors inline-flex items-center gap-1">
          Виж всички продукти
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}

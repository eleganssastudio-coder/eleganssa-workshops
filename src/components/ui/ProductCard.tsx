'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string[]
  inStock: boolean
  featured?: boolean
  category?: { name: string; slug: string }
}

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
    })
    toast.success('Добавено в количката!')
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      slug: product.slug,
    })
    toast.success(inWishlist ? 'Премахнато от любими' : 'Добавено в любими')
  }

  return (
    <Link href={`/magazin/${product.slug}`} className={cn('group block', className)}>
      <div className="relative overflow-hidden bg-cream aspect-square mb-4">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {product.comparePrice && product.comparePrice > product.price && (
          <div className="absolute top-3 left-3 bg-terracotta text-cream text-xs px-2 py-1 font-sans tracking-wide uppercase">
            Промо
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-navy/40 flex items-center justify-center">
            <span className="text-cream font-sans text-sm tracking-widest uppercase">Изчерпан</span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlist}
            className="w-9 h-9 bg-white flex items-center justify-center hover:bg-cream transition-colors"
            aria-label="Добави в любими"
          >
            <Heart
              className={cn('w-4 h-4', inWishlist ? 'fill-terracotta text-terracotta' : 'text-navy')}
            />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="w-full bg-navy text-cream py-3 text-xs tracking-widest uppercase font-sans flex items-center justify-center gap-2 hover:bg-sage transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="w-4 h-4" />
            Добави в количката
          </button>
        </div>
      </div>
      <div>
        {product.category && (
          <p className="text-sage text-xs tracking-widest uppercase mb-1">{product.category.name}</p>
        )}
        <h3 className="font-serif text-lg text-navy mb-1 group-hover:text-sage transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-sans text-navy font-medium">{formatPrice(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="font-sans text-gray-400 text-sm line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

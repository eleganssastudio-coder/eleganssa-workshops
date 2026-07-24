'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Minus, Plus, ChevronRight, Info } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice } from '@/lib/utils'
import StarRating from '@/components/ui/StarRating'
import ProductCard from '@/components/ui/ProductCard'
import toast from 'react-hot-toast'

type VariantOption = { value: string; price?: number | null; image?: string | null }
type Variant = { type: string; options: VariantOption[] }
type RelatedProduct = {
  _id?: string
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string[]
  inStock: boolean
  category: { name: string; slug: string }
}

export type ProductDetail = {
  _id?: string
  id?: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string[]
  description?: string
  shortDescription?: string
  ingredients?: string
  inStock: boolean
  variants?: Variant[]
  category: { name: string; slug: string }
}

function getSelectedPrice(basePrice: number, variants: Variant[], selected: Record<string, string>): number {
  for (const variant of variants) {
    const chosenValue = selected[variant.type]
    if (chosenValue) {
      const opts = Array.isArray(variant.options) ? variant.options : []
      const opt = opts.find(o => o.value === chosenValue)
      if (opt?.price) return opt.price
    }
  }
  return basePrice
}

const staticReviews = [
  {
    id: '1',
    author: 'Мария Д.',
    rating: 5,
    title: 'Невероятен аромат!',
    body: 'Свещта мирише фантастично и гори много равномерно. Вече съм купила 3 пъти.',
    date: 'Ноември 2024',
    verified: true,
  },
  {
    id: '2',
    author: 'Елена К.',
    rating: 5,
    title: 'Перфектен подарък',
    body: 'Купих за приятелката си и тя беше в екстаз. Опаковката е красива, свещта - изключителна.',
    date: 'Октомври 2024',
    verified: true,
  },
]

export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: ProductDetail
  relatedProducts: RelatedProduct[]
}) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()

  const productId = product._id || product.id || product.slug
  const inWishlist = isInWishlist(productId)
  const variants = product.variants || []
  const currentPrice = getSelectedPrice(product.price, variants, selectedVariants)

  // If the selected variant has its own image, show it instead of the product gallery image
  const variantImage = (() => {
    for (const variant of variants) {
      const chosenValue = selectedVariants[variant.type]
      if (chosenValue) {
        const opts = Array.isArray(variant.options) ? variant.options : []
        const opt = opts.find(o => o.value === chosenValue)
        if (opt?.image) return opt.image
      }
    }
    return null
  })()
  const displayImage = variantImage || product.images[selectedImage]

  const variantString = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ')

  const handleAddToCart = () => {
    addItem({
      id: productId,
      name: product.name,
      price: currentPrice,
      image: product.images[0],
      quantity,
      variant: variantString || undefined,
    })
    toast.success('Добавено в количката!')
  }

  const handleWishlist = () => {
    toggleItem({
      id: productId,
      name: product.name,
      price: product.price,
      image: product.images[0],
      slug: product.slug,
    })
    toast.success(inWishlist ? 'Премахнато от любими' : 'Добавено в любими')
  }

  const toText = (v: any): string => {
    if (!v) return ''
    if (typeof v === 'string') return v
    if (Array.isArray(v)) return v.map((b: any) => b.children?.map((c: any) => c.text || '').join('') || '').join('\n\n')
    return ''
  }
  const description = toText(product.description) || toText(product.shortDescription)

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-sans text-navy/50 mb-8">
          <Link href="/" className="hover:text-navy transition-colors">Начало</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/magazin" className="hover:text-navy transition-colors">Магазин</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href={`/magazin?cat=${product.category.slug}`} className="hover:text-navy transition-colors">
            {product.category.name}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-navy">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-cream overflow-hidden mb-4">
              {displayImage ? (
                <Image
                  src={displayImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-navy/30 font-sans text-sm">
                  Снимката предстои
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-20 overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? 'border-navy' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="section-subtitle">{product.category.name}</p>
            <h1 className="font-serif text-3xl md:text-4xl text-navy mb-4">{product.name}</h1>

            <div className="flex items-center gap-3 mb-6">
              <StarRating rating={5} />
              <span className="font-sans text-sm text-navy/50">(2 отзива)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-serif text-3xl text-navy">{formatPrice(currentPrice)}</span>
              {product.comparePrice && product.comparePrice > currentPrice && (
                <span className="font-sans text-gray-400 text-lg line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            <p className="font-sans text-xs text-navy/50 mb-8">Цената включва ДДС</p>

            {/* Variants */}
            {variants.map((variant) => (
              <div key={variant.type} className="mb-6">
                <p className="font-sans text-sm font-medium text-navy mb-3">{variant.type}</p>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(variant.options) ? variant.options : []).map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedVariants((prev) => ({ ...prev, [variant.type]: opt.value }))}
                      className={`px-4 py-2 border text-sm font-sans transition-colors ${
                        selectedVariants[variant.type] === opt.value
                          ? 'border-navy bg-navy text-cream'
                          : 'border-navy/20 text-navy hover:border-navy'
                      }`}
                    >
                      {opt.value}{opt.price ? ` — ${formatPrice(opt.price)}` : ''}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="mb-8">
              <p className="font-sans text-sm font-medium text-navy mb-3">Количество</p>
              <div className="flex items-center border border-navy/20 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-cream transition-colors"
                >
                  <Minus className="w-4 h-4 text-navy" />
                </button>
                <span className="w-12 text-center font-sans text-navy">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-cream transition-colors"
                >
                  <Plus className="w-4 h-4 text-navy" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" />
                {product.inStock ? 'Добави в количката' : 'Изчерпан'}
              </button>
              <button
                onClick={handleWishlist}
                className="w-12 h-12 border border-navy/20 flex items-center justify-center hover:bg-cream transition-colors"
                aria-label="Добави в любими"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-terracotta text-terracotta' : 'text-navy'}`} />
              </button>
            </div>

            {product.inStock && (
              <Link href="/checkout" className="btn-outline w-full text-center block mb-8">
                Купи сега
              </Link>
            )}

            {/* Info */}
            <div className="border-t border-cream pt-6 space-y-4">
              {description && (
                <div>
                  <h3 className="font-serif text-lg text-navy mb-2">Описание</h3>
                  <p className="font-sans text-sm text-navy/70 leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                </div>
              )}
              {product.ingredients && (
                <div>
                  <h3 className="font-serif text-lg text-navy mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Съставки
                  </h3>
                  <p className="font-sans text-sm text-navy/70 leading-relaxed">
                    {product.ingredients}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mb-20">
          <div className="mb-8">
            <h2 className="section-title">Отзиви на клиенти</h2>
            <div className="flex items-center gap-3 mt-2">
              <StarRating rating={5} size="lg" />
              <span className="font-sans text-navy/60">{staticReviews.length} отзива</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {staticReviews.map((review) => (
              <div key={review.id} className="bg-cream p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-sans font-medium text-navy text-sm">{review.author}</p>
                    {review.verified && (
                      <p className="font-sans text-xs text-sage">Потвърдена покупка</p>
                    )}
                  </div>
                  <p className="font-sans text-xs text-navy/40">{review.date}</p>
                </div>
                <StarRating rating={review.rating} className="mb-3" />
                <h4 className="font-serif text-navy mb-2">{review.title}</h4>
                <p className="font-sans text-sm text-navy/70 leading-relaxed italic">
                  &ldquo;{review.body}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="text-center mb-10">
              <p className="section-subtitle">Може да ви хареса и</p>
              <h2 className="section-title">Свързани продукти</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

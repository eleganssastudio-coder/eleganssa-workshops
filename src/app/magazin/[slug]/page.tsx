'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Heart, ShoppingBag, Minus, Plus, ChevronRight, Info, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice } from '@/lib/utils'
import StarRating from '@/components/ui/StarRating'
import ProductCard from '@/components/ui/ProductCard'
import toast from 'react-hot-toast'

const products: Record<string, {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number | null
  images: string[]
  description: string
  ingredients: string
  inStock: boolean
  variants: { name: string; values: string[] }[]
  category: { name: string; slug: string }
}> = {
  'soeva-sveshta-lavandula-vaniliya': {
    id: '1',
    name: 'Соева свещ "Лавандула и ванилия"',
    slug: 'soeva-sveshta-lavandula-vaniliya',
    price: 28,
    comparePrice: 35,
    images: [
      'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800',
      'https://images.unsplash.com/photo-1602607703866-e4a1437cf5b7?w=800',
      'https://images.unsplash.com/photo-1543854589-b3cc58d5f27e?w=800',
    ],
    description:
      'Ръчно изработена соева свещ с естествен аромат на лавандула и топла ванилия. Изработена от 100% натурален соев восък, без парафин. Времето на горене е приблизително 40 часа. Идеална за релакс и медитация.\n\nВсяка свещ е изработена ръчно в нашето ателие с любов и внимание към детайлите. Памучният фитил осигурява равномерно горене и минимален дим.',
    ingredients: '100% соев восък, парфюмно масло от лавандула и ванилия (без фталати), памучен фитил',
    inStock: true,
    variants: [
      { name: 'Размер', values: ['100мл', '200мл', '300мл'] },
    ],
    category: { name: 'Соеви свещи', slug: 'soevi-sveshti' },
  },
  'soeva-sveshta-morski-briz': {
    id: '2',
    name: 'Соева свещ "Морски бриз"',
    slug: 'soeva-sveshta-morski-briz',
    price: 25,
    comparePrice: null,
    images: [
      'https://images.unsplash.com/photo-1602607703866-e4a1437cf5b7?w=800',
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800',
    ],
    description: 'Освежаваща соева свещ с морски аромат, идеална за летни вечери. Изработена от натурален соев восък с добавка на ракита и морска сол за декорация. Времето на горене е 35 часа.',
    ingredients: '100% соев восък, парфюмно масло с морски аромат, памучен фитил, декоративна морска сол',
    inStock: true,
    variants: [
      { name: 'Размер', values: ['100мл', '200мл'] },
    ],
    category: { name: 'Соеви свещи', slug: 'soevi-sveshti' },
  },
  'jesmonite-kupa-mramor': {
    id: '4',
    name: 'Jesmonite купа "Мрамор"',
    slug: 'jesmonite-kupa-mramor',
    price: 45,
    comparePrice: null,
    images: [
      'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    ],
    description: 'Декоративна купа от Jesmonite с мраморен ефект. Всяко изделие е уникално и се различава по шарката. Подходяща за бижута, ключове или като декорация. Размери: 15 x 15 cm.\n\nJesmonite е водна минерална основа, безопасна и екологична. Повърхността е покрита с матов защитен лак.',
    ingredients: 'Jesmonite AC100, минерални пигменти, защитно матово покритие',
    inStock: true,
    variants: [
      { name: 'Цвят', values: ['Бяло-сиво', 'Черно-бяло', 'Бежово-кафяво'] },
    ],
    category: { name: 'Jesmonite изделия', slug: 'jesmonite-izdeliya' },
  },
}

const relatedProducts = [
  {
    id: '2',
    name: 'Соева свещ "Морски бриз"',
    slug: 'soeva-sveshta-morski-briz',
    price: 25,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1602607703866-e4a1437cf5b7?w=800'],
    inStock: true,
    category: { name: 'Соеви свещи', slug: 'soevi-sveshti' },
  },
  {
    id: '3',
    name: 'Соева свещ "Sandalwood & Роза"',
    slug: 'soeva-sveshta-sandalwood-roza',
    price: 32,
    comparePrice: 40,
    images: ['https://images.unsplash.com/photo-1543854589-b3cc58d5f27e?w=800'],
    inStock: true,
    category: { name: 'Соеви свещи', slug: 'soevi-sveshti' },
  },
  {
    id: '7',
    name: 'Подаръчен комплект "Уют"',
    slug: 'podarachen-komplekt-uyut',
    price: 85,
    comparePrice: 108,
    images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800'],
    inStock: true,
    category: { name: 'Комплекти', slug: 'komplekti' },
  },
  {
    id: '4',
    name: 'Jesmonite купа "Мрамор"',
    slug: 'jesmonite-kupa-mramor',
    price: 45,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800'],
    inStock: true,
    category: { name: 'Jesmonite изделия', slug: 'jesmonite-izdeliya' },
  },
]

const reviews = [
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

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products[params.slug]
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const addItem = useCartStore((s) => s.addItem)
  const { toggleItem, isInWishlist } = useWishlistStore()

  if (!product) {
    // For demo purposes, show a generic product instead of 404
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-4xl text-navy mb-4">Продуктът не е намерен</h1>
        <Link href="/magazin" className="btn-primary">Към магазина</Link>
      </div>
    )
  }

  const inWishlist = isInWishlist(product.id)

  const variantString = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ')

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      variant: variantString || undefined,
    })
    toast.success('Добавено в количката!')
  }

  const handleWishlist = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      slug: product.slug,
    })
    toast.success(inWishlist ? 'Премахнато от любими' : 'Добавено в любими')
  }

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
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
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
              <span className="font-serif text-3xl text-navy">{formatPrice(product.price)}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="font-sans text-gray-400 text-lg line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
            <p className="font-sans text-xs text-navy/50 mb-8">Цената включва ДДС</p>

            {/* Variants */}
            {product.variants.map((variant) => (
              <div key={variant.name} className="mb-6">
                <p className="font-sans text-sm font-medium text-navy mb-3">{variant.name}</p>
                <div className="flex flex-wrap gap-2">
                  {variant.values.map((value) => (
                    <button
                      key={value}
                      onClick={() => setSelectedVariants((prev) => ({ ...prev, [variant.name]: value }))}
                      className={`px-4 py-2 border text-sm font-sans transition-colors ${
                        selectedVariants[variant.name] === value
                          ? 'border-navy bg-navy text-cream'
                          : 'border-navy/20 text-navy hover:border-navy'
                      }`}
                    >
                      {value}
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
              <div>
                <h3 className="font-serif text-lg text-navy mb-2">Описание</h3>
                <p className="font-sans text-sm text-navy/70 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
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
              <span className="font-sans text-navy/60">{reviews.length} отзива</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
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
        <div>
          <div className="text-center mb-10">
            <p className="section-subtitle">Може да ви хареса и</p>
            <h2 className="section-title">Свързани продукти</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

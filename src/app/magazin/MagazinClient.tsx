'use client'

import { useState } from 'react'
import ProductCard from '@/components/ui/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/components/ui/ProductCard'

const categories = [
  { id: 'all', name: 'Всички' },
  { id: 'aromati-za-doma', name: 'Аромати за дома' },
  { id: 'komplekti', name: 'Комплекти' },
  { id: 'dekor-za-doma-ot-jesmonite', name: 'Декор за дома от Jesmonite' },
]

const sortOptions = [
  { value: 'featured', label: 'Препоръчани' },
  { value: 'price-asc', label: 'Цена ↑' },
  { value: 'price-desc', label: 'Цена ↓' },
  { value: 'newest', label: 'Най-нови' },
]

type SanityProduct = Product & { _id?: string; categorySlug?: string; category?: { name: string; slug: string } }

export default function MagazinClient({ products }: { products: SanityProduct[] }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sort, setSort] = useState('featured')
  const [loading] = useState(false)

  const filtered = products
    .filter((p) => {
      if (activeCategory === 'all') return true
      const slug = p.categorySlug || p.category?.slug || ''
      return slug === activeCategory
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      return 0
    })

  return (
    <>
      {/* Header */}
      <div className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="section-subtitle">Онлайн магазин</p>
          <h1 className="font-serif text-5xl text-navy">Магазин</h1>
          <div className="w-16 h-px bg-sage mx-auto mt-4" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 font-sans text-sm tracking-wide transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-navy text-cream'
                    : 'border border-navy/20 text-navy hover:border-navy'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <span className="font-sans text-sm text-navy/60">Сортирай:</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-navy/20 text-navy font-sans text-sm px-3 py-2 bg-transparent focus:outline-none focus:border-navy"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="font-sans text-sm text-navy/50 mb-8">
          {filtered.length} {filtered.length === 1 ? 'продукт' : 'продукта'}
        </p>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filtered.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-navy mb-2">Няма намерени продукти</p>
            <p className="text-navy/50 font-sans text-sm">Опитайте с друга категория</p>
          </div>
        )}
      </div>
    </>
  )
}

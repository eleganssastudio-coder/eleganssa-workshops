'use client'

import { useState } from 'react'
import ProductCard from '@/components/ui/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/Skeleton'
import type { Product } from '@/components/ui/ProductCard'

const categories = [
  { id: 'all', name: 'Всички' },
  { id: 'soevi-sveshti', name: 'Соеви свещи' },
  { id: 'jesmonite-izdeliya', name: 'Jesmonite изделия' },
  { id: 'komplekti', name: 'Комплекти' },
]

const sortOptions = [
  { value: 'featured', label: 'Препоръчани' },
  { value: 'price-asc', label: 'Цена ↑' },
  { value: 'price-desc', label: 'Цена ↓' },
  { value: 'newest', label: 'Най-нови' },
]

const allProducts: (Product & { categorySlug: string })[] = [
  {
    id: '1',
    name: 'Соева свещ "Лавандула и ванилия"',
    slug: 'soeva-sveshta-lavandula-vaniliya',
    price: 28,
    comparePrice: 35,
    images: ['https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800'],
    inStock: true,
    featured: true,
    categorySlug: 'soevi-sveshti',
    category: { name: 'Соеви свещи', slug: 'soevi-sveshti' },
  },
  {
    id: '2',
    name: 'Соева свещ "Морски бриз"',
    slug: 'soeva-sveshta-morski-briz',
    price: 25,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1602607703866-e4a1437cf5b7?w=800'],
    inStock: true,
    featured: true,
    categorySlug: 'soevi-sveshti',
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
    featured: false,
    categorySlug: 'soevi-sveshti',
    category: { name: 'Соеви свещи', slug: 'soevi-sveshti' },
  },
  {
    id: '4',
    name: 'Jesmonite купа "Мрамор"',
    slug: 'jesmonite-kupa-mramor',
    price: 45,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800'],
    inStock: true,
    featured: true,
    categorySlug: 'jesmonite-izdeliya',
    category: { name: 'Jesmonite изделия', slug: 'jesmonite-izdeliya' },
  },
  {
    id: '5',
    name: 'Jesmonite поднос "Терацо"',
    slug: 'jesmonite-podnos-teratso',
    price: 65,
    comparePrice: 80,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'],
    inStock: true,
    featured: true,
    categorySlug: 'jesmonite-izdeliya',
    category: { name: 'Jesmonite изделия', slug: 'jesmonite-izdeliya' },
  },
  {
    id: '6',
    name: 'Jesmonite свещник "Минимал"',
    slug: 'jesmonite-sveshnik-minimal',
    price: 35,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800'],
    inStock: true,
    featured: false,
    categorySlug: 'jesmonite-izdeliya',
    category: { name: 'Jesmonite изделия', slug: 'jesmonite-izdeliya' },
  },
  {
    id: '7',
    name: 'Подаръчен комплект "Уют"',
    slug: 'podarachen-komplekt-uyut',
    price: 85,
    comparePrice: 108,
    images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800'],
    inStock: true,
    featured: true,
    categorySlug: 'komplekti',
    category: { name: 'Комплекти', slug: 'komplekti' },
  },
  {
    id: '8',
    name: 'Подаръчен комплект "Релакс"',
    slug: 'podarachen-komplekt-relaks',
    price: 75,
    comparePrice: 93,
    images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800'],
    inStock: true,
    featured: false,
    categorySlug: 'komplekti',
    category: { name: 'Комплекти', slug: 'komplekti' },
  },
]

export default function MagazinPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [sort, setSort] = useState('featured')
  const [loading] = useState(false)

  const filtered = allProducts
    .filter((p) => activeCategory === 'all' || p.categorySlug === activeCategory)
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
              <ProductCard key={product.id} product={product} />
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

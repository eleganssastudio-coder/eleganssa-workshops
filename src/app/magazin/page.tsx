import { client } from '@/sanity/client'
import { productsQuery } from '@/sanity/queries'
import MagazinClient from './MagazinClient'

export const revalidate = 60

const STATIC_PRODUCTS = [
  {
    _id: '1',
    id: '1',
    name: 'Соева свещ "Лавандула и ванилия"',
    slug: 'soeva-sveshta-lavandula-vaniliya',
    price: 28,
    comparePrice: 35,
    images: ['https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800'],
    inStock: true,
    featured: true,
    category: { name: 'Соеви свещи', slug: 'soevi-sveshti' },
  },
  {
    _id: '2',
    id: '2',
    name: 'Соева свещ "Морски бриз"',
    slug: 'soeva-sveshta-morski-briz',
    price: 25,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1602607703866-e4a1437cf5b7?w=800'],
    inStock: true,
    featured: true,
    category: { name: 'Соеви свещи', slug: 'soevi-sveshti' },
  },
  {
    _id: '3',
    id: '3',
    name: 'Соева свещ "Sandalwood & Роза"',
    slug: 'soeva-sveshta-sandalwood-roza',
    price: 32,
    comparePrice: 40,
    images: ['https://images.unsplash.com/photo-1543854589-b3cc58d5f27e?w=800'],
    inStock: true,
    featured: false,
    category: { name: 'Соеви свещи', slug: 'soevi-sveshti' },
  },
  {
    _id: '4',
    id: '4',
    name: 'Jesmonite купа "Мрамор"',
    slug: 'jesmonite-kupa-mramor',
    price: 45,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800'],
    inStock: true,
    featured: true,
    category: { name: 'Jesmonite изделия', slug: 'jesmonite-izdeliya' },
  },
  {
    _id: '5',
    id: '5',
    name: 'Jesmonite поднос "Терацо"',
    slug: 'jesmonite-podnos-teratso',
    price: 65,
    comparePrice: 80,
    images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'],
    inStock: true,
    featured: true,
    category: { name: 'Jesmonite изделия', slug: 'jesmonite-izdeliya' },
  },
  {
    _id: '6',
    id: '6',
    name: 'Jesmonite свещник "Минимал"',
    slug: 'jesmonite-sveshnik-minimal',
    price: 35,
    comparePrice: null,
    images: ['https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800'],
    inStock: true,
    featured: false,
    category: { name: 'Jesmonite изделия', slug: 'jesmonite-izdeliya' },
  },
  {
    _id: '7',
    id: '7',
    name: 'Подаръчен комплект "Уют"',
    slug: 'podarachen-komplekt-uyut',
    price: 85,
    comparePrice: 108,
    images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800'],
    inStock: true,
    featured: true,
    category: { name: 'Комплекти', slug: 'komplekti' },
  },
  {
    _id: '8',
    id: '8',
    name: 'Подаръчен комплект "Релакс"',
    slug: 'podarachen-komplekt-relaks',
    price: 75,
    comparePrice: 93,
    images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800'],
    inStock: true,
    featured: false,
    category: { name: 'Комплекти', slug: 'komplekti' },
  },
]

export default async function MagazinPage() {
  let products = []

  try {
    if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      products = await client.fetch(productsQuery) || []
    }
  } catch (e) {
    // fallback to static data
  }

  if (!products.length) {
    products = STATIC_PRODUCTS
  } else {
    products = products.map((p: any) => ({
      ...p,
      id: p._id || p.id || p.slug,
      images: Array.isArray(p.images) ? p.images.filter(Boolean) : [],
      categorySlug: p.category?.slug || '',
    }))
  }

  return <MagazinClient products={products} />
}

import { NextResponse } from 'next/server'

// In a real app this would query Prisma
// For now returns static data
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined

  const products = [
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

  let result = products
  if (category) result = result.filter((p) => p.categorySlug === category)
  if (featured === 'true') result = result.filter((p) => p.featured)
  if (limit) result = result.slice(0, limit)

  return NextResponse.json(result)
}

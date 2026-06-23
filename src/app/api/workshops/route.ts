import { NextResponse } from 'next/server'

export async function GET() {
  const workshops = [
    {
      id: '1',
      title: 'Работилница за соеви свещи',
      slug: 'rabotilnitsa-soevi-sveshti',
      shortDesc: 'Научете изкуството на правенето на соеви свещи.',
      image: 'https://images.unsplash.com/photo-1608181831718-2d4e2f0e5f31?w=800',
      price: 39,
      duration: '2.5 часа',
      maxSpots: 8,
    },
    {
      id: '2',
      title: 'Работилница за Jesmonite изделия',
      slug: 'rabotilnitsa-jesmonite',
      shortDesc: 'Открийте магията на Jesmonite.',
      image: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?w=800',
      price: 45,
      duration: '3 часа',
      maxSpots: 6,
    },
  ]

  return NextResponse.json(workshops)
}

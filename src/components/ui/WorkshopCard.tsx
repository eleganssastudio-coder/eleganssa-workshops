import Image from 'next/image'
import Link from 'next/link'
import { Clock, Users } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export interface Workshop {
  id: string
  title: string
  slug: string
  shortDesc: string
  image: string
  price: number
  duration: string
  maxSpots: number
}

interface WorkshopCardProps {
  workshop: Workshop
}

export default function WorkshopCard({ workshop }: WorkshopCardProps) {
  return (
    <div className="group bg-white border border-cream/80 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/rabotilnitsi/${workshop.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={workshop.image}
            alt={workshop.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-4 text-cream text-xs font-sans">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {workshop.duration}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                До {workshop.maxSpots} участника
              </span>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-serif text-xl text-navy mb-2 group-hover:text-sage transition-colors">
            {workshop.title}
          </h3>
          <p className="text-navy/70 text-sm font-sans leading-relaxed mb-4 line-clamp-2">
            {workshop.shortDesc}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-sage uppercase tracking-widest font-sans mb-1">Цена на участник</p>
              <p className="font-serif text-2xl text-terracotta">{formatPrice(workshop.price)}</p>
            </div>
            <span className="btn-primary text-xs">
              Запиши се
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

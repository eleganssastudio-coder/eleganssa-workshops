import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-4">
        <p className="font-serif text-8xl text-cream mb-4">404</p>
        <h1 className="font-serif text-4xl text-navy mb-4">Страницата не е намерена</h1>
        <p className="font-sans text-navy/60 mb-8 leading-relaxed">
          Изглежда, че тази страница не съществува или е преместена. Върнете се към началото или разгледайте нашия магазин.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Начало
          </Link>
          <Link href="/magazin" className="btn-outline">
            Магазин
          </Link>
        </div>
      </div>
    </div>
  )
}

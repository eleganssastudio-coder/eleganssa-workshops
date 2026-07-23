import Link from 'next/link'
import { Instagram, Facebook, MapPin, Mail, Phone } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Начало' },
  { href: '/magazin', label: 'Магазин' },
  { href: '/rabotilnitsi', label: 'Работилници' },
  { href: '/za-nas', label: 'За нас' },
  { href: '/kontakti', label: 'Контакти' },
]

const workshopLinks = [
  { href: '/rabotilnitsi/rabotilnitsa-soevi-sveshti', label: 'Работилница за свещи' },
  { href: '/rabotilnitsi/rabotilnitsa-jesmonite', label: 'Работилница Jesmonite' },
]

const legalLinks = [
  { href: '/politika-za-poveritelnost', label: 'Политика за поверителност' },
  { href: '/obshti-uslovia', label: 'Общи условия' },
  { href: '/pravo-na-otkaz', label: 'Право на отказ' },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="block mb-4">
              <span className="font-serif text-2xl text-cream tracking-wider lowercase">
                eleganssa studio
              </span>
            </Link>
            <p className="font-serif text-cream/60 italic text-lg mb-6">
              "Твори. Миксирай. Създай."
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/eleganssastudio/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-cream/30 flex items-center justify-center hover:border-cream hover:bg-cream/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-cream/30 flex items-center justify-center hover:border-cream hover:bg-cream/10 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-cream/50 mb-6">
              Навигация
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-cream font-sans text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Workshops */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-cream/50 mb-6">
              Работилници
            </h4>
            <ul className="space-y-3">
              {workshopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-cream font-sans text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-sans text-xs tracking-widest uppercase text-cream/50 mt-8 mb-6">
              Правна информация
            </h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/70 hover:text-cream font-sans text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase text-cream/50 mb-6">
              Контакти
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                <span className="text-cream/70 font-sans text-sm">
                  Варна, ул. Бреза 2
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:eleganssastudio@gmail.com"
                  className="text-cream/70 hover:text-cream font-sans text-sm transition-colors"
                >
                  eleganssastudio@gmail.com
                </a>
              </li>
              <li className="flex gap-3">
                <Instagram className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                <a
                  href="https://www.instagram.com/eleganssastudio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/70 hover:text-cream font-sans text-sm transition-colors"
                >
                  @eleganssastudio
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-cream/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/40 font-sans text-xs">
            © 2024 Eleganssa Studio. Всички права запазени.
          </p>
          <p className="text-cream/40 font-sans text-xs">
            Ръчно изработено с любов във Варна, България
          </p>
        </div>
      </div>
    </footer>
  )
}

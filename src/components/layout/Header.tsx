'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Начало' },
  { href: '/magazin', label: 'Магазин' },
  { href: '/rabotilnitsi', label: 'Работилници' },
  { href: '/vaucheri', label: 'Ваучери' },
  { href: '/za-nas', label: 'За нас' },
  { href: '/kontakti', label: 'Контакти' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const toggleCart = useCartStore((s) => s.toggleCart)
  const totalItems = useCartStore((s) => s.totalItems)
  const wishlistCount = useWishlistStore((s) => s.items.length)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
          scrolled ? 'bg-light-cream/95 backdrop-blur-md shadow-sm' : 'bg-light-cream'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="font-serif text-xl md:text-2xl text-navy tracking-wider lowercase">
                eleganssa studio
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-navy/80 hover:text-navy font-sans text-sm tracking-wide transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-sage group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-1 md:gap-2">
              <Link
                href="/magazin"
                className="p-2 text-navy hover:text-sage transition-colors rounded-full hover:bg-cream"
                aria-label="Търсене"
              >
                <Search className="w-5 h-5" />
              </Link>
              <Link
                href="/profil"
                className="relative p-2 text-navy hover:text-sage transition-colors rounded-full hover:bg-cream"
                aria-label="Любими"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-terracotta text-cream text-xs flex items-center justify-center rounded-full font-sans">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <button
                onClick={toggleCart}
                className="relative p-2 text-navy hover:text-sage transition-colors rounded-full hover:bg-cream"
                aria-label="Количка"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-navy text-cream text-xs flex items-center justify-center rounded-full font-sans">
                    {totalItems()}
                  </span>
                )}
              </button>
              <Link
                href="/profil"
                className="p-2 text-navy hover:text-sage transition-colors rounded-full hover:bg-cream hidden md:flex"
                aria-label="Профил"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-navy"
                aria-label="Меню"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden bg-light-cream border-t border-cream">
            <nav className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-2xl text-navy hover:text-sage transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-cream">
                <Link
                  href="/profil"
                  onClick={() => setMobileOpen(false)}
                  className="font-sans text-sm text-navy/60 hover:text-navy transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Моят профил
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { User, ShoppingBag, Heart, MapPin, LogOut, ChevronRight } from 'lucide-react'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice } from '@/lib/utils'
import ProductCard from '@/components/ui/ProductCard'

type Tab = 'orders' | 'wishlist' | 'addresses' | 'settings'

const mockOrders = [
  {
    id: '1',
    orderNumber: 'ES-123456',
    date: '15 Ноември 2024',
    status: 'Доставена',
    total: 85,
    items: ['Подаръчен комплект "Уют"'],
  },
  {
    id: '2',
    orderNumber: 'ES-789012',
    date: '3 Декември 2024',
    status: 'В обработка',
    total: 53,
    items: ['Соева свещ "Лавандула и ванилия"', 'Jesmonite свещник "Минимал"'],
  },
]

const statusColors: Record<string, string> = {
  'Доставена': 'text-sage bg-sage/10',
  'В обработка': 'text-terracotta bg-terracotta/10',
  'Изпратена': 'text-navy bg-navy/10',
}

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState<Tab>('orders')
  const wishlist = useWishlistStore((s) => s.items)

  const tabs = [
    { id: 'orders' as Tab, label: 'Поръчки', icon: ShoppingBag },
    { id: 'wishlist' as Tab, label: 'Любими', icon: Heart },
    { id: 'addresses' as Tab, label: 'Адреси', icon: MapPin },
    { id: 'settings' as Tab, label: 'Настройки', icon: User },
  ]

  return (
    <>
      <div className="bg-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="section-subtitle">Моят акаунт</p>
              <h1 className="font-serif text-4xl text-navy">Профил</h1>
            </div>
            <button className="flex items-center gap-2 font-sans text-sm text-navy/50 hover:text-navy transition-colors">
              <LogOut className="w-4 h-4" />
              Изход
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-cream p-6 mb-4">
              <div className="w-16 h-16 bg-navy rounded-full flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-cream" />
              </div>
              <h2 className="font-serif text-xl text-navy">Мария Д.</h2>
              <p className="font-sans text-sm text-navy/50">maria@example.com</p>
            </div>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 font-sans text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-navy text-cream'
                      : 'text-navy hover:bg-cream'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div>
                <h2 className="font-serif text-2xl text-navy mb-6">Моите поръчки</h2>
                {mockOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-cream mx-auto mb-3" />
                    <p className="font-serif text-xl text-navy mb-2">Няма поръчки</p>
                    <Link href="/magazin" className="btn-primary">Към магазина</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="bg-cream p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-sans text-sm font-medium text-navy">
                              {order.orderNumber}
                            </p>
                            <p className="font-sans text-xs text-navy/50">{order.date}</p>
                          </div>
                          <span className={`font-sans text-xs px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="space-y-1 mb-4">
                          {order.items.map((item) => (
                            <p key={item} className="font-sans text-sm text-navy/70">{item}</p>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-lg text-navy">
                            {formatPrice(order.total)}
                          </span>
                          <button className="font-sans text-xs text-navy/50 hover:text-navy transition-colors border border-navy/20 px-3 py-1">
                            Детайли
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <h2 className="font-serif text-2xl text-navy mb-6">Любими</h2>
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-cream mx-auto mb-3" />
                    <p className="font-serif text-xl text-navy mb-2">Списъкът с любими е празен</p>
                    <Link href="/magazin" className="btn-primary">Разгледай магазина</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlist.map((item) => (
                      <ProductCard
                        key={item.id}
                        product={{
                          id: item.id,
                          name: item.name,
                          slug: item.slug,
                          price: item.price,
                          images: [item.image],
                          inStock: true,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="font-serif text-2xl text-navy mb-6">Адреси за доставка</h2>
                <div className="bg-cream p-6 mb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-sans text-sm font-medium text-navy mb-1">Мария Димитрова</p>
                      <p className="font-sans text-sm text-navy/60">ул. Пример 5</p>
                      <p className="font-sans text-sm text-navy/60">9000 Варна</p>
                      <p className="font-sans text-sm text-navy/60">+359 88 123 4567</p>
                    </div>
                    <span className="bg-navy text-cream text-xs px-2 py-1 font-sans">По подразбиране</span>
                  </div>
                </div>
                <button className="btn-outline">
                  Добави адрес
                </button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="font-serif text-2xl text-navy mb-6">Настройки на профила</h2>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Ime</label>
                      <input
                        type="text"
                        defaultValue="Мария"
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-navy mb-2">Фамилия</label>
                      <input
                        type="text"
                        defaultValue="Димитрова"
                        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-sans text-sm text-navy mb-2">Имейл</label>
                    <input
                      type="email"
                      defaultValue="maria@example.com"
                      className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-navy bg-transparent focus:outline-none focus:border-navy"
                    />
                  </div>
                  <button className="btn-primary">Запази промените</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

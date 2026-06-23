import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingBag, Users, Calendar, TrendingUp, Package, Settings, BarChart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Администрация',
}

const stats = [
  { label: 'Общ приход', value: '4,238 €', change: '+12%', icon: TrendingUp, color: 'text-sage' },
  { label: 'Поръчки', value: '47', change: '+5%', icon: ShoppingBag, color: 'text-navy' },
  { label: 'Резервации', value: '23', change: '+8%', icon: Calendar, color: 'text-terracotta' },
  { label: 'Клиенти', value: '156', change: '+15%', icon: Users, color: 'text-sage' },
]

const recentOrders = [
  { id: 'ES-001', customer: 'Мария Д.', product: 'Подаръчен комплект "Уют"', total: 85, status: 'Платена' },
  { id: 'ES-002', customer: 'Елена К.', product: 'Соева свещ "Лавандула"', total: 28, status: 'Изпратена' },
  { id: 'ES-003', customer: 'Петя М.', product: 'Jesmonite купа "Мрамор"', total: 45, status: 'В обработка' },
  { id: 'ES-004', customer: 'Ива Г.', product: 'Работилница за свещи x2', total: 78, status: 'Потвърдена' },
]

const statusColors: Record<string, string> = {
  'Платена': 'bg-sage/10 text-sage',
  'Изпратена': 'bg-navy/10 text-navy',
  'В обработка': 'bg-terracotta/10 text-terracotta',
  'Потвърдена': 'bg-sage/10 text-sage',
}

const navItems = [
  { href: '/admin', label: 'Начало', icon: BarChart },
  { href: '/admin/products', label: 'Продукти', icon: Package },
  { href: '/admin/orders', label: 'Поръчки', icon: ShoppingBag },
  { href: '/admin/bookings', label: 'Резервации', icon: Calendar },
  { href: '/admin/customers', label: 'Клиенти', icon: Users },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-light-cream flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy min-h-screen flex-shrink-0">
        <div className="p-6 border-b border-cream/10">
          <Link href="/" className="font-serif text-xl text-cream tracking-wider lowercase">
            eleganssa studio
          </Link>
          <p className="font-sans text-xs text-cream/40 mt-1">Администрация</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-cream/60 hover:text-cream hover:bg-cream/10 transition-colors font-sans text-sm"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-navy mb-1">Добре дошли</h1>
          <p className="font-sans text-sm text-navy/50">Преглед на магазина</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <span className="font-sans text-xs text-sage">{stat.change}</span>
              </div>
              <p className="font-serif text-3xl text-navy mb-1">{stat.value}</p>
              <p className="font-sans text-sm text-navy/50">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl text-navy">Последни поръчки</h2>
            <Link href="/admin/orders" className="font-sans text-sm text-sage hover:text-navy transition-colors">
              Виж всички
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream">
                  <th className="text-left font-sans text-xs uppercase tracking-wider text-navy/50 pb-3">ID</th>
                  <th className="text-left font-sans text-xs uppercase tracking-wider text-navy/50 pb-3">Клиент</th>
                  <th className="text-left font-sans text-xs uppercase tracking-wider text-navy/50 pb-3">Продукт</th>
                  <th className="text-right font-sans text-xs uppercase tracking-wider text-navy/50 pb-3">Сума</th>
                  <th className="text-right font-sans text-xs uppercase tracking-wider text-navy/50 pb-3">Статус</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-cream/50 hover:bg-light-cream transition-colors">
                    <td className="py-4 font-sans text-sm text-navy/50">{order.id}</td>
                    <td className="py-4 font-sans text-sm text-navy">{order.customer}</td>
                    <td className="py-4 font-sans text-sm text-navy/70">{order.product}</td>
                    <td className="py-4 font-sans text-sm text-navy text-right">{order.total} €</td>
                    <td className="py-4 text-right">
                      <span className={`font-sans text-xs px-2 py-1 ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Добави продукт', href: '/admin/products/new', icon: Package },
            { label: 'Нова работилница', href: '/admin/workshops/new', icon: Calendar },
            { label: 'Изпрати бюлетин', href: '/admin/newsletter', icon: Users },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="bg-cream flex items-center gap-3 p-4 hover:bg-cream/70 transition-colors"
            >
              <action.icon className="w-5 h-5 text-navy" />
              <span className="font-sans text-sm text-navy">{action.label}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

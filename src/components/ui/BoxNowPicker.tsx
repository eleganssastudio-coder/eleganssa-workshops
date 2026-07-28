'use client'

import { useEffect, useState, useRef } from 'react'
import { X, Search, MapPin, Loader2 } from 'lucide-react'
import type { BoxNowLocker } from '@/lib/boxnow'

type Props = {
  onSelect: (locker: BoxNowLocker) => void
  onClose: () => void
}

export default function BoxNowPicker({ onSelect, onClose }: Props) {
  const [lockers, setLockers] = useState<BoxNowLocker[]>([])
  const [filtered, setFiltered] = useState<BoxNowLocker[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    fetch('/api/boxnow/lockers')
      .then((r) => r.json())
      .then((data: BoxNowLocker[]) => {
        setLockers(data)
        setFiltered(data)
        setLoading(false)
        setTimeout(() => inputRef.current?.focus(), 100)
      })
      .catch(() => { setError(true); setLoading(false) })
  }, [])

  useEffect(() => {
    const q = search.toLowerCase().trim()
    if (!q) { setFiltered(lockers); return }
    setFiltered(lockers.filter((l) =>
      l.name.toLowerCase().includes(q) ||
      l.city.toLowerCase().includes(q) ||
      l.address.toLowerCase().includes(q)
    ))
  }, [search, lockers])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy/10">
          <h3 className="font-serif text-xl text-navy">Изберете BoxNow автомат</h3>
          <button onClick={onClose} className="p-1 text-navy/40 hover:text-navy transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-navy/10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Търсете по град или адрес..."
              className="w-full pl-9 pr-4 py-2.5 border border-navy/20 font-sans text-sm text-navy focus:outline-none focus:border-navy"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-16 gap-3 text-navy/40">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-sans text-sm">Зарежда автомати...</span>
            </div>
          )}

          {error && (
            <div className="py-12 text-center font-sans text-sm text-navy/50 px-6">
              Не успяхме да заредим списъка. Моля, въведете адреса ръчно по-долу.
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="py-12 text-center font-sans text-sm text-navy/50">
              Няма намерени автомати.
            </div>
          )}

          {!loading && !error && filtered.map((locker) => (
            <button
              key={locker.id}
              onClick={() => { onSelect(locker); onClose() }}
              className="w-full text-left px-6 py-4 border-b border-navy/5 hover:bg-cream transition-colors flex items-start gap-3"
            >
              <MapPin className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-sans text-sm font-medium text-navy">{locker.name}</p>
                <p className="font-sans text-xs text-navy/50 mt-0.5">
                  {locker.address}{locker.city ? `, ${locker.city}` : ''}
                  {locker.postCode ? ` ${locker.postCode}` : ''}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Count */}
        {!loading && !error && (
          <div className="px-6 py-3 border-t border-navy/10 bg-cream">
            <p className="font-sans text-xs text-navy/40">
              {filtered.length} автомата{search ? ` за "${search}"` : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

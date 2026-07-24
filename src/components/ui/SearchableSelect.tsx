'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, X } from 'lucide-react'

type Option = { id: string; label: string; sublabel?: string }

type Props = {
  options: Option[]
  value: string | null
  onChange: (id: string, label: string) => void
  placeholder?: string
  searchPlaceholder?: string
}

export default function SearchableSelect({ options, value, onChange, placeholder = 'Изберете...', searchPlaceholder = 'Търсете...' }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = options.find((o) => o.id === value)

  const filtered = query.trim()
    ? options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()) ||
        (o.sublabel?.toLowerCase().includes(query.toLowerCase()) ?? false)
      )
    : options

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full border border-navy/20 px-4 py-3 font-sans text-sm text-left flex items-center justify-between gap-2 bg-transparent hover:border-navy transition-colors focus:outline-none focus:border-navy"
      >
        <span className={selected ? 'text-navy' : 'text-navy/40'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-navy/40 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-navy/20 shadow-lg">
          <div className="p-2 border-b border-navy/10 flex items-center gap-2">
            <Search className="w-4 h-4 text-navy/30 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="flex-1 font-sans text-sm text-navy bg-transparent focus:outline-none placeholder:text-navy/30"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')}>
                <X className="w-4 h-4 text-navy/30 hover:text-navy" />
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="font-sans text-sm text-navy/40 text-center py-6">Няма резултати</p>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => { onChange(o.id, o.label); setOpen(false); setQuery('') }}
                  className={`w-full text-left px-4 py-3 font-sans text-sm hover:bg-cream transition-colors ${value === o.id ? 'bg-navy/5 text-navy font-medium' : 'text-navy'}`}
                >
                  <span>{o.label}</span>
                  {o.sublabel && <span className="block text-xs text-navy/40 mt-0.5">{o.sublabel}</span>}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

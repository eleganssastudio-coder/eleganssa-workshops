'use client'

import { useEffect, useRef, useState } from 'react'
import { X, ExternalLink } from 'lucide-react'

type Props = {
  type: 'boxnow' | 'speedy'
  onClose: () => void
  onManual: (address: string) => void
}

const config = {
  boxnow: {
    title: 'Изберете BoxNow автомат',
    url: 'https://boxnow.bg/locker-finder',
    fallbackUrl: 'https://boxnow.bg/locker-finder',
    placeholder: 'напр. BoxNow — Mall of Sofia, ет. 0',
  },
  speedy: {
    title: 'Изберете офис на Спиди',
    url: 'https://www.speedy.bg/bg/speedy-offices-automats',
    fallbackUrl: 'https://www.speedy.bg/bg/speedy-offices-automats',
    placeholder: 'напр. Спиди — бул. Витоша 10, София',
  },
}

export default function LocationFinderModal({ type, onClose, onManual }: Props) {
  const [iframeBlocked, setIframeBlocked] = useState(false)
  const [manualAddress, setManualAddress] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const cfg = config[type]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Detect if iframe is blocked (load fires but content is blank due to X-Frame-Options)
  const handleIframeLoad = () => {
    try {
      // If we can access contentDocument, it loaded fine
      const doc = iframeRef.current?.contentDocument
      if (!doc || doc.body?.innerHTML === '') setIframeBlocked(true)
    } catch {
      setIframeBlocked(true)
    }
  }

  const handleIframeError = () => setIframeBlocked(true)

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualAddress.trim()) return
    onManual(manualAddress.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy/10 flex-shrink-0">
          <h3 className="font-serif text-xl text-navy">{cfg.title}</h3>
          <button onClick={onClose} className="p-1 text-navy/40 hover:text-navy transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {!iframeBlocked ? (
            <iframe
              ref={iframeRef}
              src={cfg.url}
              className="w-full h-full min-h-[500px] border-0"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              title={cfg.title}
            />
          ) : (
            <div className="p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
              <p className="font-sans text-navy/60 mb-6 max-w-sm">
                Страницата не може да се зареди тук. Отворете я в нов прозорец, намерете желания адрес и го въведете по-долу.
              </p>
              <a
                href={cfg.fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 mb-8"
              >
                <ExternalLink className="w-4 h-4" />
                Отвори {type === 'boxnow' ? 'BoxNow' : 'Спиди'} в нов прозорец
              </a>
            </div>
          )}
        </div>

        {/* Manual entry fallback always shown at bottom */}
        <form onSubmit={handleManualSubmit} className="border-t border-navy/10 px-6 py-4 flex-shrink-0 bg-cream">
          <p className="font-sans text-xs text-navy/50 mb-2">
            {iframeBlocked
              ? 'Въведете адреса, намерен на горния линк:'
              : 'Или въведете адреса ръчно:'}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualAddress}
              onChange={(e) => setManualAddress(e.target.value)}
              placeholder={cfg.placeholder}
              className="flex-1 border border-navy/20 px-4 py-2.5 font-sans text-sm text-navy bg-white focus:outline-none focus:border-navy"
            />
            <button type="submit" disabled={!manualAddress.trim()} className="btn-primary px-5 text-sm disabled:opacity-40">
              Потвърди
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

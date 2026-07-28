'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import type { BoxNowLocker } from '@/lib/boxnow'

const PARTNER_ID = 15925

declare global {
  interface Window {
    bn_map_widget_config: any
  }
}

type Props = {
  onSelect: (locker: BoxNowLocker) => void
  onClose: () => void
}

export default function BoxNowPicker({ onSelect, onClose }: Props) {
  const [scriptReady, setScriptReady] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    window.bn_map_widget_config = {
      partnerId: PARTNER_ID,
      parentElement: '#boxnowmap',
      autoclose: true,
      autoselect: false,
      afterSelect: (selected: any) => {
        onSelect({
          id: String(selected.boxnowLockerId ?? ''),
          name: selected.boxnowLockerName ?? selected.boxnowLockerAddressLine1 ?? '',
          address: selected.boxnowLockerAddressLine1 ?? '',
          city: selected.boxnowLockerCity ?? '',
          postCode: selected.boxnowLockerPostalCode ?? '',
        })
        onClose()
      },
    }
  }, [onSelect, onClose])

  useEffect(() => {
    if (scriptReady && buttonRef.current) {
      setTimeout(() => buttonRef.current?.click(), 200)
    }
  }, [scriptReady])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl shadow-2xl" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy/10">
          <h3 className="font-serif text-xl text-navy">Изберете BoxNow автомат</h3>
          <button onClick={onClose} className="p-1 text-navy/40 hover:text-navy transition-colors text-xl leading-none">✕</button>
        </div>
        <div className="p-4">
          {!scriptReady && (
            <p className="text-center font-sans text-sm text-navy/50 py-4">Зарежда...</p>
          )}
          <button
            ref={buttonRef}
            className="boxnow-map-widget-button btn-primary w-full text-center"
            style={{ display: scriptReady ? 'block' : 'none' }}
          >
            Отвори картата с автоматите
          </button>
          <div id="boxnowmap" className="w-full mt-4" />
        </div>
      </div>

      <Script
        src="https://widget-cdn.boxnow.gr/map-widget/client/v5.js"
        strategy="lazyOnload"
        onReady={() => setScriptReady(true)}
        onLoad={() => setScriptReady(true)}
      />
    </div>
  )
}

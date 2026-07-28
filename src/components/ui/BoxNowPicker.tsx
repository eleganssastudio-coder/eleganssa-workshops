'use client'

import { useEffect } from 'react'
import type { BoxNowLocker } from '@/lib/boxnow'

const PARTNER_ID = 15925

declare global {
  interface Window {
    _bn_map_widget_config: any
  }
}

type Props = {
  onSelect: (locker: BoxNowLocker) => void
  onClose: () => void
}

export default function BoxNowPicker({ onSelect, onClose }: Props) {
  useEffect(() => {
    window._bn_map_widget_config = {
      partnerId: PARTNER_ID,
      parentElement: '#boxnowmap',
      afterSelect: (selected: any) => {
        onSelect({
          id: String(selected.boxnowLockerId),
          name: selected.boxnowLockerName || selected.boxnowLockerAddressLine1 || '',
          address: selected.boxnowLockerAddressLine1 || '',
          city: selected.boxnowLockerCity || '',
          postCode: selected.boxnowLockerPostalCode || '',
        })
        onClose()
      },
    }

    if (!document.getElementById('boxnow-widget-script')) {
      const script = document.createElement('script')
      script.id = 'boxnow-widget-script'
      script.src = 'https://widgetcdn.boxnow.bg/map-widget/client/v5.js'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  }, [onSelect, onClose])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl shadow-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy/10">
          <h3 className="font-serif text-xl text-navy">Изберете BoxNow автомат</h3>
          <button onClick={onClose} className="p-1 text-navy/40 hover:text-navy transition-colors text-xl leading-none">✕</button>
        </div>
        <div className="p-4 flex flex-col gap-4">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <a href="javascript:;" className="boxnow-widget-button btn-primary block text-center">
            Отвори картата с автоматите
          </a>
          <div id="boxnowmap" className="w-full min-h-96" />
        </div>
      </div>
    </div>
  )
}

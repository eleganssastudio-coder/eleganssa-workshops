'use client'

import { useEffect } from 'react'
import type { BoxNowLocker } from '@/lib/boxnow'

const PARTNER_ID = 15925
const WIDGET_URL = `https://map.boxnow.gr/popup.html?countryCode=bg&language=bg&partnerId=${PARTNER_ID}&autoselect=no&autoclose=yes`

type Props = {
  onSelect: (locker: BoxNowLocker) => void
  onClose: () => void
}

export default function BoxNowPicker({ onSelect, onClose }: Props) {
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!event.origin.includes('boxnow')) return
      const data = event.data
      if (!data) return
      // The widget posts the selected locker data
      const id = String(data.boxnowLockerId ?? data.id ?? data.lockerId ?? '')
      if (!id) return
      onSelect({
        id,
        name: data.boxnowLockerName ?? data.name ?? data.boxnowLockerAddressLine1 ?? '',
        address: data.boxnowLockerAddressLine1 ?? data.address ?? '',
        city: data.boxnowLockerCity ?? data.city ?? '',
        postCode: data.boxnowLockerPostalCode ?? data.postCode ?? data.zip ?? '',
      })
      onClose()
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onSelect, onClose])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl shadow-2xl" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy/10 flex-shrink-0">
          <h3 className="font-serif text-xl text-navy">Изберете BoxNow автомат</h3>
          <button onClick={onClose} className="p-1 text-navy/40 hover:text-navy transition-colors text-xl leading-none">✕</button>
        </div>
        <div className="flex-1 overflow-hidden" style={{ minHeight: '500px' }}>
          <iframe
            src={WIDGET_URL}
            width="100%"
            height="100%"
            style={{ border: 'none', minHeight: '500px', display: 'block' }}
            title="BoxNow Locker Map"
            allow="geolocation"
          />
        </div>
      </div>
    </div>
  )
}

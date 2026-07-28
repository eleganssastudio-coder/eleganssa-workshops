'use client'

import { useEffect, useRef } from 'react'
import type { BoxNowLocker } from '@/lib/boxnow'

const PARTNER_ID = 15925
const IFRAME_URL = `https://map.boxnow.gr/iframe.html?countryCode=bg&language=bg&partnerId=${PARTNER_ID}&autoselect=no&autoclose=yes`
const POPUP_URL = `https://map.boxnow.gr/popup.html?countryCode=bg&language=bg&partnerId=${PARTNER_ID}&autoselect=no&autoclose=yes`

type Props = {
  onSelect: (locker: BoxNowLocker) => void
  onClose: () => void
}

export default function BoxNowPicker({ onSelect, onClose }: Props) {
  const popupRef = useRef<Window | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!event.origin.includes('boxnow')) return
      const data = event.data
      if (!data) return

      const id = String(data.boxnowLockerId ?? data.id ?? data.lockerId ?? data.delivery_point_id ?? '')
      if (!id) return

      onSelect({
        id,
        name: data.boxnowLockerName ?? data.name ?? data.title ?? data.boxnowLockerAddressLine1 ?? '',
        address: data.boxnowLockerAddressLine1 ?? data.address ?? data.street ?? '',
        city: data.boxnowLockerCity ?? data.city ?? '',
        postCode: data.boxnowLockerPostalCode ?? data.postCode ?? data.post_code ?? data.zip ?? '',
      })

      if (popupRef.current) popupRef.current.close()
      onClose()
    }

    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
      if (popupRef.current) popupRef.current.close()
    }
  }, [onSelect, onClose])

  function openPopup() {
    popupRef.current = window.open(POPUP_URL, 'boxnow_picker', 'width=900,height=650,left=200,top=100')
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-3xl shadow-2xl flex flex-col" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy/10 flex-shrink-0">
          <h3 className="font-serif text-xl text-navy">Изберете BoxNow автомат</h3>
          <button onClick={onClose} className="p-1 text-navy/40 hover:text-navy transition-colors text-xl leading-none">✕</button>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
          <iframe
            ref={iframeRef}
            src={IFRAME_URL}
            width="100%"
            style={{ border: 'none', flex: 1, minHeight: '500px', display: 'block' }}
            title="BoxNow Locker Map"
            allow="geolocation"
          />
        </div>
        <div className="px-6 py-3 border-t border-navy/10 flex-shrink-0 text-center">
          <p className="text-sm text-navy/50 mb-2">Ако картата не се зарежда, отворете я в отделен прозорец:</p>
          <button
            type="button"
            onClick={openPopup}
            className="btn-primary text-sm px-6 py-2"
          >
            Отвори картата в нов прозорец
          </button>
        </div>
      </div>
    </div>
  )
}

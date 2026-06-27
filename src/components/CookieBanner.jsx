import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie_consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-gray-900 text-white px-4 py-4 shadow-2xl">
      <div className="max-w-lg mx-auto">
        <p className="text-sm leading-relaxed mb-3">
          🍪 Wir nutzen Cookies für Analysen und personalisierte Werbung (z.B. Meta Pixel).
          Weitere Infos in unserer{' '}
          <span className="underline cursor-pointer text-green-400">Datenschutzerklärung</span>.
        </p>
        <div className="flex gap-2">
          <button
            onClick={accept}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
          >
            Alle akzeptieren
          </button>
          <button
            onClick={decline}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
          >
            Ablehnen
          </button>
        </div>
      </div>
    </div>
  )
}

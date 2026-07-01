import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible]       = useState(false)
  const [settings, setSettings]     = useState(false)
  const [marketing, setMarketing]   = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie_consent', 'accepted')
    setVisible(false)
  }

  const saveSettings = () => {
    localStorage.setItem('cookie_consent', marketing ? 'accepted' : 'declined')
    setVisible(false)
  }

  if (!visible) return null

  if (settings) return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-gray-900 text-white px-4 py-5 shadow-2xl">
      <div className="max-w-lg mx-auto">
        <p className="font-bold text-sm mb-3">Cookie-Einstellungen</p>
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">Notwendige Cookies</p>
              <p className="text-xs text-gray-400">Für die Funktion der Website</p>
            </div>
            <span className="text-xs text-gray-400 font-medium">Immer aktiv</span>
          </div>
          <div className="flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2.5">
            <div>
              <p className="text-sm font-medium">Marketing-Cookies</p>
              <p className="text-xs text-gray-400">Meta Pixel für personalisierte Werbung</p>
            </div>
            <button onClick={() => setMarketing(m => !m)}
              className={`w-11 h-6 rounded-full transition-colors ${marketing ? 'bg-brand-600' : 'bg-gray-600'}`}>
              <div className={`w-5 h-5 bg-white rounded-full mx-0.5 transition-transform ${marketing ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={saveSettings}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-sm">
            Speichern
          </button>
          <button onClick={accept}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-xl text-sm">
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] bg-gray-900 text-white px-4 py-4 shadow-2xl">
      <div className="max-w-lg mx-auto">
        <p className="text-sm leading-relaxed mb-3">
          🍪 Wir nutzen Cookies für Analysen und personalisierte Werbung (z.B. Meta Pixel).
          Weitere Infos in unserer{' '}
          <span className="underline cursor-pointer text-green-400">Datenschutzerklärung</span>.
        </p>
        <div className="flex gap-2">
          <button onClick={accept}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white font-bold py-2.5 rounded-xl text-sm">
            Alle akzeptieren
          </button>
          <button onClick={() => setSettings(true)}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 rounded-xl text-sm">
            Einstellungen
          </button>
        </div>
      </div>
    </div>
  )
}

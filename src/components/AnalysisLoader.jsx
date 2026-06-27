import { useState, useEffect } from 'react'

const MESSAGES = [
  { text: 'Analysiere Stoffwechselprofil…',               icon: '🔬' },
  { text: 'Vergleiche Daten mit 10.000+ Männern über 50…', icon: '📊' },
  { text: 'Erstelle gelenkschonenden Bewegungsplan…',      icon: '🏃' },
  { text: 'Berechne Kaloriendefizit ohne Hungern…',        icon: '⚖️' },
]
const STEP_MS = 2000
const TOTAL_MS = MESSAGES.length * STEP_MS

export default function AnalysisLoader({ onComplete }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setMsgIndex(i => Math.min(i + 1, MESSAGES.length - 1)), STEP_MS)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const start = Date.now()
    let raf
    const tick = () => {
      const pct = Math.min(((Date.now() - start) / TOTAL_MS) * 100, 100)
      setProgress(pct)
      if (pct < 100) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    const t = setTimeout(onComplete, TOTAL_MS + 400)
    return () => clearTimeout(t)
  }, [onComplete])

  const current = MESSAGES[msgIndex]

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-lg mx-auto w-full">
      <div className="relative mb-10">
        <div className="w-28 h-28 rounded-full border-4 border-gray-100" />
        <div className="absolute inset-0 w-28 h-28 rounded-full border-4 border-transparent border-t-brand-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-4xl">{current.icon}</div>
      </div>
      <div key={msgIndex} className="text-center mb-10 animate-fade-up min-h-[56px] flex items-center">
        <p className="text-xl font-bold text-gray-800 leading-snug">{current.text}</p>
      </div>
      <div className="flex gap-2 mb-8">
        {MESSAGES.map((_, i) => (
          <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i <= msgIndex ? 'bg-brand-600 scale-110' : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div className="bg-brand-600 h-2.5 rounded-full" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-sm text-gray-400 tabular-nums">{Math.round(progress)}%</p>
      <div className="mt-10 bg-brand-50 border border-brand-100 rounded-2xl px-5 py-4 text-sm text-brand-700 text-center">
        💡 Dein persönlicher Plan wird auf Basis deiner Antworten individuell berechnet
      </div>
    </div>
  )
}

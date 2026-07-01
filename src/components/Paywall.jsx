import { useState, useEffect } from 'react'
import Logo from './Logo'
import { pixelInitCheckout, pixelAddToCart } from '../utils/pixel'


const PLANS = [
  { id: '1m', duration: '1 Monat',  label: 'Basis',        price: '24,99 €', note: 'Einmalzahlung · kein Abo · inkl. MwSt.', badge: null,            popular: false },
  { id: '3m', duration: '3 Monate', label: 'Empfohlen',    price: '44,99 €', note: 'Einmalzahlung · kein Abo · inkl. MwSt.', badge: '40% günstiger', popular: true  },
  { id: '6m', duration: '6 Monate', label: 'Bester Wert',  price: '59,99 €', note: 'Einmalzahlung · kein Abo · inkl. MwSt.', badge: '60% günstiger', popular: false },
]

const REVIEWS = [
  { name: 'Klaus M., 58',  text: 'Nach 3 Monaten 12 kg leichter – ohne Hungern!',               avatar: 'https://ui-avatars.com/api/?name=Klaus+M&background=dcfce7&color=15803d&size=80&bold=true' },
  { name: 'Werner S., 63', text: 'Meine Knieschmerzen sind fast weg. Hätte ich nie gedacht.',    avatar: 'https://ui-avatars.com/api/?name=Werner+S&background=dcfce7&color=15803d&size=80&bold=true' },
  { name: 'Dieter B., 55', text: 'Endlich ein Plan der für ältere Männer gemacht ist.',          avatar: 'https://ui-avatars.com/api/?name=Dieter+B&background=dcfce7&color=15803d&size=80&bold=true' },
]

function PlanCard({ plan, selected, onSelect }) {
  return (
    <button onClick={() => onSelect(plan.id)}
      className={`relative w-full text-left rounded-2xl border-2 p-4 transition-all duration-150
        ${selected ? 'border-brand-600 bg-brand-50 shadow-md' : 'border-gray-200 bg-white hover:border-brand-300'}`}>
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
          ⭐ Am beliebtesten
        </span>
      )}
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-brand-600 bg-brand-600' : 'border-gray-300'}`}>
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        <div className="flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className={`text-lg font-extrabold ${selected ? 'text-brand-700' : 'text-gray-900'}`}>{plan.duration}</span>
              <span className="text-sm text-gray-500 ml-2">({plan.label})</span>
            </div>
            <span className="font-extrabold text-gray-900 text-lg shrink-0">{plan.price}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-gray-400">{plan.note}</span>
            {plan.badge && <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded-full">{plan.badge}</span>}
          </div>
        </div>
      </div>
    </button>
  )
}

export default function Paywall({ answers, onLegal }) {
  const [selected, setSelected] = useState('3m')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => { pixelInitCheckout() }, [])

  const body = answers.body || {}
  const cw   = body.currentWeight || 95
  const tw   = body.targetWeight  || 80
  const selectedPlan = PLANS.find(p => p.id === selected)

  const handleCheckout = async () => {
    pixelAddToCart(PLANS.find(p => p.id === selected)?.price)
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ planId: selected, commitment: answers.commitment || 'weekly' }) })
      const data = await res.json()
      if (data.url) {
        localStorage.setItem('vp_answers', JSON.stringify({ ...answers, planId: selected }))
        window.location.href = data.url
      }
      else { throw new Error(data.error) }
    } catch {
      setError('Zahlung konnte nicht gestartet werden. Bitte versuche es erneut.')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto w-full px-4 pt-0 pb-36">

      {/* Hero */}
      <div className="relative mb-6 -mx-4">
        <img src="https://images.pexels.com/photos/8899515/pexels-photo-8899515.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop"
             alt="Älterer Mann macht Übungen zuhause"
             className="w-full h-52 object-cover"
             onError={e => { e.target.parentElement.style.display = 'none' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent flex items-end p-5">
          <div>
            <div className="mb-1"><Logo size="sm" light /></div>
            <p className="text-white font-extrabold text-xl">Dein Plan ist fertig!</p>
            <p className="text-white/80 text-sm mt-0.5">Maßgeschneidert für Männer ab 35</p>
          </div>
        </div>
      </div>

      {/* Inhalte */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <h2 className="font-bold text-gray-900 mb-3">Was du bekommst:</h2>
        <ul className="space-y-2.5">
          {[
            ['📅', 'Tägliche 15-Minuten-Workouts', 'Gelenkschonend, zuhause ohne Geräte'],
            ['🍽️', 'Persönlicher Ernährungsplan',  'Kein Hungern – echte Gerichte'],
            ['🦴', 'Schmerzfrei-Programm',          'Für Knie, Rücken & Nacken'],
            ['📲', 'Sofortiger Zugang per E-Mail',  'Link kommt direkt nach dem Kauf'],
            ['🛡️', '60 Tage Geld-zurück',           'Kein Ergebnis = volle Rückerstattung'],
          ].map(([icon, title, sub]) => (
            <li key={title} className="flex items-start gap-3">
              <span className="text-xl shrink-0 leading-none mt-0.5">{icon}</span>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Ziel */}
      <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 mb-5 flex items-center gap-4">
        <div className="text-4xl">🎯</div>
        <div>
          <p className="text-brand-800 font-extrabold">Von {cw} kg auf {tw} kg</p>
          <p className="text-brand-600 text-xs mt-0.5">Realistisch erreichbar in 3–6 Monaten</p>
        </div>
      </div>

      {/* Preisauswahl */}
      <h2 className="font-bold text-gray-900 mb-3">Wähle deinen Zugang:</h2>
      <div className="space-y-3 mb-5">
        {PLANS.map(plan => <PlanCard key={plan.id} plan={plan} selected={selected === plan.id} onSelect={setSelected} />)}
      </div>

      {/* 60-Tage-Garantie Banner */}
      <div className="bg-brand-50 border-2 border-brand-400 rounded-2xl p-4 mb-5 flex items-center gap-4">
        <div className="text-5xl shrink-0">🛡️</div>
        <div>
          <p className="text-brand-800 font-extrabold text-base leading-tight">60-Tage Geld-zurück-Garantie</p>
          <p className="text-brand-700 text-xs mt-1 leading-snug">
            Kein Ergebnis nach 60 Tagen? Du bekommst jeden Cent zurück —
            vollständig, ohne Diskussion. Schreib uns einfach eine E-Mail.
          </p>
        </div>
      </div>

      {/* Trust */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[['🔒','Stripe-gesichert','Bankstandard-Verschlüsselung'],['⚡','Sofortiger Zugang','Per E-Mail nach Kauf'],['🏅','50.000+ Männer','Vertrauen auf VitalMuscle'],['📋','Kein Abo','Einmalig zahlen, dauerhaft nutzen']].map(([icon, t, s]) => (
          <div key={t} className="bg-white rounded-xl border border-gray-100 p-3 flex items-start gap-2">
            <span className="text-xl shrink-0">{icon}</span>
            <div><p className="text-xs font-bold text-gray-800">{t}</p><p className="text-xs text-gray-400">{s}</p></div>
          </div>
        ))}
      </div>

      {/* Bewertungen */}
      <h2 className="font-bold text-gray-900 mb-3">Das sagen echte Mitglieder:</h2>
      <div className="space-y-3 mb-6">
        {REVIEWS.map(r => (
          <div key={r.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">
            <img src={r.avatar} alt={r.name} className="w-11 h-11 rounded-full shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-gray-900 text-sm">{r.name}</p>
                <span className="text-yellow-400 text-xs">★★★★★</span>
              </div>
              <p className="text-sm text-gray-600 italic leading-snug">„{r.text}"</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="space-y-3 mb-6">
        {[
          ['Muss ich ins Fitnessstudio?', 'Nein. Alle Übungen funktionieren zuhause, ohne Geräte.'],
          ['Was wenn es mir nicht hilft?', 'Du bekommst 60 Tage Zeit. Kein Ergebnis → volle Rückerstattung, kein Aufwand.'],
          ['Bin ich zu alt dafür?',        'Der Plan ist speziell für Männer ab 35 entwickelt.'],
          ['Wie bekomme ich Zugang?',      'Direkt nach der Zahlung kommt dein Zugangslink per E-Mail.'],
        ].map(([q, a]) => (
          <details key={q} className="bg-white rounded-2xl border border-gray-100 p-4 group">
            <summary className="font-semibold text-gray-900 text-sm cursor-pointer list-none flex items-center justify-between">
              {q}<span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
            </summary>
            <p className="text-sm text-gray-600 mt-2">{a}</p>
          </details>
        ))}
      </div>

      {/* ── Sticky CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl safe-bottom">
        <div className="max-w-lg mx-auto px-4 pt-3 pb-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-gray-500">Einmalzahlung · kein Abo · inkl. 19% MwSt.</p>
              <p className="text-xl font-extrabold text-gray-900">{selectedPlan?.price}</p>
            </div>
            {selectedPlan?.badge && (
              <span className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1 rounded-full">{selectedPlan.badge}</span>
            )}
          </div>
          {error && <p className="text-red-500 text-xs mb-2 text-center">{error}</p>}
          <button onClick={handleCheckout} disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:opacity-60
                       text-white font-extrabold py-4 rounded-2xl text-lg transition-all shadow-lg">
            {loading ? '⏳ Weiterleitung…' : '🔓 Meinen persönlichen Plan freischalten'}
          </button>
          <p className="text-[10px] text-gray-400 mt-1 leading-snug text-center">
            Mit dem Kauf stimmst du der sofortigen Bereitstellung zu und nimmst zur Kenntnis, dass du dein{' '}
            <span className="underline cursor-pointer" onClick={() => onLegal?.('widerruf')}>Widerrufsrecht</span>{' '}
            verlierst (§ 356 Abs. 5 BGB).
          </p>
          {/* Legal-Links – nur hier, nicht im Quiz */}
          <p className="text-center text-[11px] text-gray-400 mt-1.5 leading-snug">
            🔒 Einmalzahlung via Stripe ·{' '}
            <span className="underline cursor-pointer" onClick={() => onLegal?.('agb')}>AGB</span> ·{' '}
            <span className="underline cursor-pointer" onClick={() => onLegal?.('datenschutz')}>Datenschutz</span> ·{' '}
            <span className="underline cursor-pointer" onClick={() => onLegal?.('impressum')}>Impressum</span> ·{' '}
            <span className="underline cursor-pointer" onClick={() => onLegal?.('widerruf')}>Widerruf</span>
          </p>
        </div>
      </div>
    </div>
  )
}

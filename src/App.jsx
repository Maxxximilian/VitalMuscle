import { useState, useCallback, useEffect } from 'react'
import { pixelViewContent, pixelPurchase } from './utils/pixel'
import Header from './components/Header'
import CookieBanner from './components/CookieBanner'
import LegalModal from './components/LegalModal'
import Step1Age from './components/steps/Step1Age'
import Step2Body from './components/steps/Step2Body'
import Step3Goal from './components/steps/Step3Goal'
import Step4FatZone from './components/steps/Step4FatZone'
import Step5Joints from './components/steps/Step5Joints'
import Step6Activity from './components/steps/Step6Activity'
import Step7Sleep from './components/steps/Step7Sleep'
import Step8Energy from './components/steps/Step8Energy'
import Step9Nutrition from './components/steps/Step9Nutrition'
import Step10Metabolism from './components/steps/Step10Metabolism'
import Step11History from './components/steps/Step11History'
import Step12Commitment from './components/steps/Step12Commitment'
import AnalysisLoader from './components/AnalysisLoader'
import PrognosisChart from './components/PrognosisChart'
import Paywall from './components/Paywall'
import PlanPage from './pages/PlanPage'

const QUIZ_STEPS  = 12
const params      = new URLSearchParams(window.location.search)
const TOKEN       = params.get('token')
const SESSION_ID  = params.get('session_id')

// ── Erfolgs-Screen nach Kauf (session_id) ─────────────────────────────────
function PurchaseSuccess() {
  const [planId, setPlanId]         = useState(null)
  const [commitment, setCommitment] = useState(null)
  const [loading, setLoading]       = useState(false)
  const [granted, setGranted]       = useState(false)

  const AMOUNTS = { '1m': 24.99, '3m': 44.99, '6m': 59.99 }

  useEffect(() => {
    fetch(`/api/verify-session?id=${SESSION_ID}`)
      .then(r => r.json())
      .then(d => { if (d.paid) pixelPurchase(AMOUNTS[d.planId] || 44.99) })
      .catch(() => {})
  }, [])

  const openNow = () => {
    setLoading(true)
    fetch(`/api/verify-session?id=${SESSION_ID}`)
      .then(r => r.json())
      .then(d => {
        if (d.paid) {
          setPlanId(d.planId); setCommitment(d.commitment); setGranted(true)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  if (granted) return <PlanApp planId={planId} commitment={commitment} />

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full text-center">
        <div className="text-7xl mb-4">🎉</div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Zahlung erfolgreich!</h1>
        <p className="text-gray-500 mb-6 leading-relaxed">
          Dein persönlicher VitalMuscle-Plan wurde an deine E-Mail-Adresse gesendet.<br/>
          <span className="font-semibold text-gray-700">Bitte schau in dein Postfach</span> – auch im Spam-Ordner.
        </p>
        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-4 mb-6 text-left">
          <p className="text-brand-800 text-sm font-bold mb-1">📧 So geht's weiter:</p>
          <ol className="text-brand-700 text-sm space-y-1 list-decimal ml-4">
            <li>E-Mail mit Betreff „Dein VitalMuscle ist bereit" öffnen</li>
            <li>Auf „Meinen Plan jetzt öffnen" klicken</li>
            <li>Link als Lesezeichen speichern für später</li>
          </ol>
        </div>
        <button onClick={openNow} disabled={loading}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50">
          {loading ? '⏳ Prüfe…' : 'Plan jetzt direkt öffnen (ohne E-Mail)'}
        </button>
      </div>
    </div>
  )
}

function AccessVerifier({ onGranted, onDenied }) {
  useState(() => {
    if (TOKEN) {
      fetch(`/api/verify-token?token=${TOKEN}`)
        .then(r => r.json())
        .then(d => d.valid ? onGranted(d.planId, d.commitment) : onDenied())
        .catch(() => onDenied())
    } else if (SESSION_ID) {
      fetch(`/api/verify-session?id=${SESSION_ID}`)
        .then(r => r.json())
        .then(d => d.paid ? onGranted(d.planId, d.commitment) : onDenied())
        .catch(() => onDenied())
    }
  })
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-4 border-brand-600 border-t-transparent animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Zugang wird geprüft…</p>
      </div>
    </div>
  )
}

// ── Plan-Seite (nach Kauf) ─────────────────────────────────────────────────
function PlanApp({ planId, commitment }) {
  const [legalPage, setLegalPage] = useState(null)
  return (
    <>
      <PlanPage planId={planId} commitment={commitment} onLegal={setLegalPage} />
      {legalPage && <LegalModal page={legalPage} onClose={() => setLegalPage(null)} />}
    </>
  )
}

function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-sm">
        <p className="text-5xl mb-4">🔒</p>
        <h1 className="text-xl font-extrabold text-gray-900 mb-2">Link ungültig</h1>
        <p className="text-gray-500 text-sm mb-6">
          Bitte prüfe deine E-Mail nach dem Zugangslink oder schreib uns.
        </p>
        <a href="mailto:hallo@vitalmuscle.de"
           className="inline-block bg-brand-600 text-white font-bold px-6 py-3 rounded-xl">
          hallo@vitalmuscle.de
        </a>
        <br />
        <a href="/" className="inline-block mt-3 text-sm text-gray-400 underline">Zurück zur Startseite</a>
      </div>
    </div>
  )
}

// ── Quiz-Funnel ────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState({})
  const [access, setAccess]         = useState(null)
  const [planId, setPlanId]         = useState(null)
  const [commitment, setCommitment] = useState(null)
  const [legalPage, setLegalPage] = useState(null)

  // Kauf-Redirect (session_id) → "check deine Mail"-Screen
  if (SESSION_ID && !TOKEN) return <PurchaseSuccess />

  // Token-Zugang (E-Mail-Link) → Plan direkt öffnen
  if (TOKEN) {
    if (access === null)     return <AccessVerifier onGranted={(id, cm) => { setPlanId(id); setCommitment(cm); setAccess('granted') }} onDenied={() => setAccess('denied')} />
    if (access === 'denied') return <AccessDenied />
    return <PlanApp planId={planId} commitment={commitment} />
  }

  const advance      = useCallback(() => setStep(s => s + 1), [])
  const handleAnswer = useCallback((key, value) => {
    if (key === 'age') pixelViewContent()
    setAnswers(prev => ({ ...prev, [key]: value }))
    setStep(s => s + 1)
  }, [])

  const isQuiz   = step < QUIZ_STEPS
  const progress = isQuiz ? ((step + 1) / QUIZ_STEPS) * 100 : 100

  const renderScreen = () => {
    switch (step) {
      case 0:  return <Step1Age         onAnswer={v => handleAnswer('age', v)} />
      case 1:  return <Step2Body        onAnswer={v => handleAnswer('body', v)} />
      case 2:  return <Step3Goal        onAnswer={v => handleAnswer('goal', v)} />
      case 3:  return <Step4FatZone     onAnswer={v => handleAnswer('fatZone', v)} />
      case 4:  return <Step5Joints      onAnswer={v => handleAnswer('joints', v)} />
      case 5:  return <Step6Activity    onAnswer={v => handleAnswer('activity', v)} />
      case 6:  return <Step7Sleep       onAnswer={v => handleAnswer('sleep', v)} />
      case 7:  return <Step8Energy      onAnswer={v => handleAnswer('energy', v)} />
      case 8:  return <Step9Nutrition   onAnswer={v => handleAnswer('nutrition', v)} />
      case 9:  return <Step10Metabolism onAnswer={v => handleAnswer('metabolism', v)} />
      case 10: return <Step11History    onAnswer={v => handleAnswer('history', v)} />
      case 11: return <Step12Commitment onAnswer={v => handleAnswer('commitment', v)} />
      case 12: return <AnalysisLoader   onComplete={advance} />
      case 13: return <PrognosisChart   answers={answers} onContinue={advance} />
      default: return <Paywall          answers={answers} onLegal={setLegalPage} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header step={step} progress={progress} showProgress={isQuiz} totalSteps={QUIZ_STEPS} />
      <main className="flex-1 flex flex-col">
        <div key={step} className="animate-fade-up flex-1 flex flex-col">
          {renderScreen()}
        </div>
      </main>
      <CookieBanner />
      {legalPage && <LegalModal page={legalPage} onClose={() => setLegalPage(null)} />}
    </div>
  )
}

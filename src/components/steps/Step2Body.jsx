import { useState } from 'react'
import QuizCard from '../QuizCard'

function Field({ label, unit, value, onChange, placeholder, error }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="number" inputMode="decimal" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full px-4 py-3.5 pr-14 border-2 rounded-xl text-gray-900 text-lg focus:outline-none transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-brand-500'}`}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">{unit}</span>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

export default function Step2Body({ onAnswer }) {
  const [height, setHeight] = useState('')
  const [currentWeight, setCurrentWeight] = useState('')
  const [targetWeight, setTargetWeight] = useState('')
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    const h = parseFloat(height), cw = parseFloat(currentWeight), tw = parseFloat(targetWeight)
    if (!h  || h  < 140 || h  > 220) errs.height = 'Bitte eine gültige Größe eingeben (140–220 cm)'
    if (!cw || cw < 40  || cw > 300) errs.currentWeight = 'Bitte ein gültiges Gewicht eingeben'
    if (!tw || tw < 40  || tw >= cw) errs.targetWeight = 'Muss kleiner als dein aktuelles Gewicht sein'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (validate()) onAnswer({ height: parseFloat(height), currentWeight: parseFloat(currentWeight), targetWeight: parseFloat(targetWeight) })
  }

  return (
    <QuizCard>
      <div className="text-center mb-7">
        <span className="text-5xl block mb-3">📏</span>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1.5">Deine Körperdaten</h1>
        <p className="text-gray-400 text-sm">Diese Angaben sind die Basis für deinen persönlichen Plan</p>
      </div>
      <div className="space-y-4">
        <Field label="Körpergröße" unit="cm" value={height} onChange={setHeight} placeholder="z.B. 178" error={errors.height} />
        <Field label="Aktuelles Gewicht" unit="kg" value={currentWeight} onChange={setCurrentWeight} placeholder="z.B. 95" error={errors.currentWeight} />
        <Field label="Wunschgewicht" unit="kg" value={targetWeight} onChange={setTargetWeight} placeholder="z.B. 80" error={errors.targetWeight} />
        <div className="pt-2">
          <button onClick={handleSubmit} className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-md shadow-brand-600/20">
            Weiter →
          </button>
        </div>
        <p className="text-center text-xs text-gray-400">🔒 Deine Daten bleiben privat und werden nicht weitergegeben</p>
      </div>
    </QuizCard>
  )
}

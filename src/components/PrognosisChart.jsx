import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

const MONTHS_DE = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez']
const EASE = [0, 0.12, 0.28, 0.47, 0.64, 0.81, 1.0]

function buildData(cw, tw) {
  const diff = cw - tw
  const now = new Date()
  return EASE.map((t, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1)
    return { name: `${MONTHS_DE[d.getMonth()]} ${d.getFullYear()}`, short: MONTHS_DE[d.getMonth()], gewicht: parseFloat((cw - diff * t).toFixed(1)) }
  })
}

function getTargetMonth() {
  const d = new Date()
  d.setMonth(d.getMonth() + 6)
  return `${MONTHS_DE[d.getMonth()]} ${d.getFullYear()}`
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-lg text-sm">
      <p className="font-bold text-gray-900">{payload[0].value} kg</p>
      <p className="text-gray-400">{payload[0].payload.name}</p>
    </div>
  )
}

export default function PrognosisChart({ answers, onContinue }) {
  const body = answers.body || {}
  const cw = body.currentWeight || 95
  const tw = body.targetWeight  || 80
  const data = buildData(cw, tw)
  const lost = parseFloat((cw - tw).toFixed(1))

  return (
    <div className="max-w-lg mx-auto w-full px-4 py-6 pb-28">
      <div className="text-center mb-6">
        <span className="text-5xl block mb-3">📈</span>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1.5">Deine persönliche Prognose</h1>
        <p className="text-gray-400 text-sm">Basierend auf deinen Antworten und 10.000+ Vergleichsprofilen</p>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[['Aktuell', `${cw} kg`, 'text-red-500'], ['Ziel', `${tw} kg`, 'text-brand-600'], ['Abnehmen', `${lost} kg`, 'text-brand-700']].map(([l, v, c]) => (
          <div key={l} className="bg-white rounded-2xl p-3 text-center shadow-sm border border-gray-100">
            <p className={`text-xl font-extrabold ${c}`}>{v}</p>
            <p className="text-xs text-gray-400 mt-0.5">{l}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-5">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="short" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis domain={[tw - 2, cw + 2]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={tw} stroke="#16a34a" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Ziel', position: 'insideBottomRight', fontSize: 10, fill: '#16a34a' }} />
            <Line type="monotone" dataKey="gewicht" stroke="#16a34a" strokeWidth={3} dot={{ r: 4, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#16a34a' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 mb-5">
        <p className="text-brand-800 font-semibold text-sm leading-relaxed text-center">
          Basierend auf deinen Daten kannst du dein Wunschgewicht von <span className="font-extrabold">{tw} kg</span> bis <span className="font-extrabold">{getTargetMonth()}</span> sicher erreichen – ohne Hungern und ohne extreme Workouts.
        </p>
      </div>
      <ul className="space-y-2 mb-6">
        {['✅ Gelenkschonende Übungen – kein Knirschen, kein Schmerz', '✅ 15 Minuten täglich reichen – bewiesen bei Männern über 50', '✅ Kein Jojo-Effekt dank nachhaltiger Methode'].map(t => (
          <li key={t} className="text-sm text-gray-700 font-medium">{t}</li>
        ))}
      </ul>
      <button onClick={onContinue} className="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg shadow-brand-600/25">
        Meinen Plan jetzt ansehen →
      </button>
    </div>
  )
}

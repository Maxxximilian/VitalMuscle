import Logo from './Logo'

export default function Footer({ onLegal }) {
  return (
    <footer className="bg-white border-t border-gray-100 py-5 px-4 mt-8">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-2"><Logo size="sm" /></div>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
          {[
            ['impressum',  'Impressum'],
            ['datenschutz','Datenschutz'],
            ['agb',        'AGB'],
            ['widerruf',   'Widerruf'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => onLegal(key)}
              className="text-xs text-gray-400 hover:text-gray-700 underline"
            >
              {label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-gray-300 mt-3">© {new Date().getFullYear()} VitalMuscle · Alle Rechte vorbehalten</p>
      </div>
    </footer>
  )
}

import Logo from './Logo'

export default function Header({ step, progress, showProgress, totalSteps }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-lg mx-auto px-4 pt-3 pb-3">
        <div className="flex items-center justify-between mb-2.5">
          <Logo size="md" />
          {showProgress && (
            <span className="text-xs font-semibold text-gray-400 tabular-nums">
              {step + 1}&nbsp;/&nbsp;{totalSteps}
            </span>
          )}
        </div>
        {showProgress && (
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-brand-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </header>
  )
}

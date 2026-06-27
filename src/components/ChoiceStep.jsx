import QuizCard from './QuizCard'

function HeroImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-44 object-cover rounded-2xl mb-5"
      onError={e => { e.target.style.display = 'none' }}
    />
  )
}

function OptionButton({ option, onAnswer }) {
  return (
    <button
      onClick={() => onAnswer(option.value)}
      className="w-full flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-2xl text-left
                 hover:border-brand-500 hover:bg-brand-50 active:scale-[0.98]
                 transition-all duration-150 group shadow-sm"
    >
      <span className="text-2xl shrink-0 leading-none">{option.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 group-hover:text-brand-700 leading-snug">{option.label}</p>
        {option.desc && <p className="text-xs text-gray-400 mt-0.5 leading-snug">{option.desc}</p>}
      </div>
      <span className="text-gray-300 group-hover:text-brand-500 text-lg shrink-0">›</span>
    </button>
  )
}

export default function ChoiceStep({ heroImage, heroAlt, icon, title, subtitle, badge, options, onAnswer }) {
  return (
    <QuizCard>
      {heroImage && <HeroImage src={heroImage} alt={heroAlt || title} />}

      <div className={`text-center ${heroImage ? 'mb-5' : 'mb-7'}`}>
        {!heroImage && (
          typeof icon === 'string' && icon.startsWith('/')
            ? <img src={icon} alt="" className="w-24 h-24 mx-auto mb-4 rounded-2xl object-cover bg-gray-100" />
            : <span className="text-5xl block mb-3 leading-none">{icon}</span>
        )}
        {badge && (
          <span className="inline-block bg-brand-100 text-brand-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {badge}
          </span>
        )}
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1.5 leading-tight">{title}</h1>
        {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
      </div>

      <div className="space-y-3">
        {options.map(opt => (
          <OptionButton key={opt.value} option={opt} onAnswer={onAnswer} />
        ))}
      </div>
    </QuizCard>
  )
}

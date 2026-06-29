export default function Logo({ size = 'md', light = false }) {
  const sizes = {
    sm: { icon: 18, font: 16, gap: 6 },
    md: { icon: 26, font: 22, gap: 8 },
    lg: { icon: 36, font: 30, gap: 10 },
  }
  const s = sizes[size]
  const iconColor  = light ? 'white' : '#16a34a'
  const vitalColor = light ? 'white' : '#15803d'
  const muscleColor = light ? 'rgba(255,255,255,0.8)' : '#16a34a'

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s.gap }}>
      <svg width={s.icon} height={s.icon} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="5,8 95,8 50,92"
          fill="none"
          stroke={iconColor}
          strokeWidth="12"
          strokeLinejoin="miter"
          strokeMiterlimit="2.1"
        />
      </svg>
      <span style={{
        fontFamily: "'GlacialIndifference', Arial, sans-serif",
        fontWeight: 700,
        fontSize: s.font,
        letterSpacing: '0.05em',
        lineHeight: 1,
      }}>
        <span style={{ color: vitalColor }}>Vital</span><span style={{ color: muscleColor }}>Muscle</span>
      </span>
    </div>
  )
}

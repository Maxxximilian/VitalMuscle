import ChoiceStep from '../ChoiceStep'
const config = {
  heroImage: 'https://images.pexels.com/photos/6975756/pexels-photo-6975756.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
  heroAlt: 'Motivierter Mann',
  icon: '🤝', title: 'Bist du bereit, täglich 15 Minuten für einfache, gelenkschonende Übungen zu investieren?',
  subtitle: 'Keine Geräte, kein Fitnessstudio – nur du und dein Plan', badge: 'Letzte Frage!',
  options: [
    { value: 'daily',     emoji: '💪', label: 'Ja, absolut!',                            desc: 'Ich bin bereit, täglich 15 Minuten zu investieren' },
    { value: 'weekly',    emoji: '📅', label: 'Lieber nur 3–4 Mal pro Woche',            desc: 'Auch das reicht für sichtbare Ergebnisse' },
    { value: 'nutrition', emoji: '🥗', label: 'Ich will mich eigentlich nur gesund ernähren', desc: 'Unser Ernährungsplan ist perfekt für dich' },
  ],
}
export default function Step12Commitment({ onAnswer }) { return <ChoiceStep {...config} onAnswer={onAnswer} /> }

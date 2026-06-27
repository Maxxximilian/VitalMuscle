import ChoiceStep from '../ChoiceStep'
const config = {
  heroImage: 'https://images.pexels.com/photos/7322460/pexels-photo-7322460.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
  heroAlt: 'Mann beim Sport',
  icon: '📋', title: 'Was hast du schon probiert?', subtitle: 'Damit wir Fehler der Vergangenheit vermeiden', badge: 'Keine Verurteilung – wir lernen daraus',
  options: [
    { value: 'diets',   emoji: '⚖️', label: 'Strikte Diäten',                       desc: 'Jojo-Effekt: das Gewicht kam immer wieder zurück' },
    { value: 'gym',     emoji: '🏋️', label: 'Fitnessstudio',                        desc: 'Zu anstrengend, teuer oder abgebrochen' },
    { value: 'nothing', emoji: '🤷', label: 'Noch nie etwas Ernsthaftes probiert',   desc: 'Jetzt ist der richtige Zeitpunkt' },
  ],
}
export default function Step11History({ onAnswer }) { return <ChoiceStep {...config} onAnswer={onAnswer} /> }

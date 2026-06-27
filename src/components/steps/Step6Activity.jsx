import ChoiceStep from '../ChoiceStep'

const config = {
  heroImage: 'https://images.pexels.com/photos/6975783/pexels-photo-6975783.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
  heroAlt: 'Mann sitzt am Schreibtisch',
  icon: '🏃',
  title: 'Wie sieht dein typischer Tag aus?',
  subtitle: 'Ehrlichkeit hilft uns, realistisch zu planen',
  options: [
    { value: 'sedentary', emoji: '🪑', label: 'Hauptsächlich sitzend / Büro',     desc: '8+ Stunden am Schreibtisch oder Sofa' },
    { value: 'standing',  emoji: '🧍', label: 'Viel Stehen',                      desc: 'Verkauf, Handwerk, Pflege o. Ä.' },
    { value: 'walking',   emoji: '🚶', label: 'Leichte Bewegung / Spaziergänge',  desc: 'Regelmäßige kurze Fußwege' },
    { value: 'active',    emoji: '⚒️', label: 'Körperliche Arbeit',               desc: 'Handwerk, Garten, körperliche Tätigkeiten' },
  ],
}
export default function Step6Activity({ onAnswer }) { return <ChoiceStep {...config} onAnswer={onAnswer} /> }

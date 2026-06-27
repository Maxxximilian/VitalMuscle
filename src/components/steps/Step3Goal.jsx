import ChoiceStep from '../ChoiceStep'

const config = {
  heroImage: 'https://images.pexels.com/photos/6972651/pexels-photo-6972651.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
  heroAlt: 'Mann macht Übungen zuhause',
  icon: '🎯',
  title: 'Was ist dein wichtigstes Ziel?',
  subtitle: 'Wähle das aus, was dir am meisten am Herzen liegt',
  options: [
    { value: 'belly',     emoji: '👖', label: 'Bauchansatz verlieren',        desc: 'Hose wieder problemlos schließen' },
    { value: 'joints',    emoji: '🦴', label: 'Gelenkschmerzen reduzieren',    desc: 'Täglich schmerzfreier bewegen' },
    { value: 'energy',    emoji: '⚡', label: 'Mehr Energie im Alltag',        desc: 'Nicht mehr so schnell erschöpft sein' },
    { value: 'grandkids', emoji: '👶', label: 'Ausdauer für die Enkelkinder',  desc: 'Mit der Familie aktiv und fit bleiben' },
  ],
}
export default function Step3Goal({ onAnswer }) { return <ChoiceStep {...config} onAnswer={onAnswer} /> }

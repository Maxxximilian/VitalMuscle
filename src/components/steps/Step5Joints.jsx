import ChoiceStep from '../ChoiceStep'

const config = {
  heroImage: 'https://images.pexels.com/photos/6975759/pexels-photo-6975759.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
  heroAlt: 'Mann mit Knieschmerzen',
  icon: '🦴',
  title: 'Leidest du unter Gelenkschmerzen?',
  subtitle: 'Unser Plan berücksichtigt deine körperlichen Einschränkungen',
  badge: 'Wichtig für deinen Plan',
  options: [
    { value: 'none',      emoji: '✅', label: 'Nein, keine Probleme' },
    { value: 'knees',     emoji: '🦵', label: 'Ja, in den Knien',       desc: 'Treppensteigen oder Kniebeugen schmerzen' },
    { value: 'back',      emoji: '🔙', label: 'Ja, im unteren Rücken',  desc: 'Nach langem Sitzen oder beim Heben' },
    { value: 'shoulders', emoji: '💆', label: 'Ja, Schultern / Nacken', desc: 'Verspannungen und Bewegungseinschränkung' },
  ],
}
export default function Step5Joints({ onAnswer }) { return <ChoiceStep {...config} onAnswer={onAnswer} /> }

import ChoiceStep from '../ChoiceStep'
const config = {
  heroImage: 'https://images.pexels.com/photos/8899525/pexels-photo-8899525.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
  heroAlt: 'Müder Mann am Schreibtisch',
  icon: '🔋', title: 'Wann fühlst du dich am schwächsten?', subtitle: 'Wir takten dein Training auf dein natürliches Energielevel',
  options: [
    { value: 'morning',   emoji: '🌅', label: 'Direkt nach dem Aufstehen',      desc: 'Morgens nie wirklich in die Gänge kommen' },
    { value: 'afternoon', emoji: '😪', label: 'Das klassische Nachmittagstief', desc: 'Gegen 14–16 Uhr einschlafen wollen' },
    { value: 'evening',   emoji: '🛋️', label: 'Abends auf der Couch',           desc: 'Nach 20 Uhr keine Energie mehr' },
  ],
}
export default function Step8Energy({ onAnswer }) { return <ChoiceStep {...config} onAnswer={onAnswer} /> }

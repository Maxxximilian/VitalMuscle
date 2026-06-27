import ChoiceStep from '../ChoiceStep'
const config = {
  heroImage: 'https://images.pexels.com/photos/8899512/pexels-photo-8899512.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
  heroAlt: 'Mann misst Taillenumfang',
  icon: '🫃', title: 'Wo lagert sich Fett am schnellsten an?', subtitle: 'Hilft uns, die richtigen Übungen zu wählen',
  options: [
    { value: 'belly',       emoji: '🫃', label: 'Hauptsächlich am Bauch / Gürtellinie', desc: 'Der klassische „Bierbauch"' },
    { value: 'distributed', emoji: '🔄', label: 'Gleichmäßig verteilt',                 desc: 'Überall etwas mehr' },
    { value: 'chest',       emoji: '👕', label: 'Brustbereich',                         desc: 'Oberkörper zuerst' },
  ],
}
export default function Step4FatZone({ onAnswer }) { return <ChoiceStep {...config} onAnswer={onAnswer} /> }

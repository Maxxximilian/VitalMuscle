import ChoiceStep from '../ChoiceStep'

const config = {
  heroImage: 'https://images.pexels.com/photos/8899520/pexels-photo-8899520.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
  heroAlt: 'Aktiver Mann Mitte 50',
  icon: '🧔',
  title: 'Wie alt bist du?',
  subtitle: 'Damit wir deinen Plan optimal anpassen können',
  options: [
    { value: '35-44', emoji: '🧔',   label: '35 – 44 Jahre', desc: 'Jetzt gegensteuern bevor es schwieriger wird' },
    { value: '45-54', emoji: '🧔‍♂️', label: '45 – 54 Jahre', desc: 'Gewicht und Energie wieder in den Griff' },
    { value: '55-64', emoji: '👴',   label: '55 – 64 Jahre', desc: 'Fit und aktiv im besten Alter' },
    { value: '65+',   emoji: '🏡',   label: '65+ Jahre',     desc: 'Sanft aber wirksam – jeden Tag besser fühlen' },
  ],
}
export default function Step1Age({ onAnswer }) { return <ChoiceStep {...config} onAnswer={onAnswer} /> }

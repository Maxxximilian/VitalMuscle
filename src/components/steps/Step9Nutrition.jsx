import ChoiceStep from '../ChoiceStep'

const config = {
  heroImage: 'https://images.pexels.com/photos/8900045/pexels-photo-8900045.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
  heroAlt: 'Gesundes Essen',
  icon: '🍽️',
  title: 'Was ist deine größte Ernährungs-Hürde?',
  subtitle: 'Kein Urteil – nur ehrliche Antworten helfen',
  options: [
    { value: 'dinner',    emoji: '🍝', label: 'Große Portionen beim Abendessen',         desc: 'Das Abendessen wird zur Hauptmahlzeit' },
    { value: 'snacks',    emoji: '🍫', label: 'Süßigkeiten / Chips vor dem Fernseher',   desc: 'Die abendliche Snack-Falle' },
    { value: 'irregular', emoji: '🍔', label: 'Unregelmäßiges Essen / Fast Food',        desc: 'Kein fester Rhythmus, oft unterwegs' },
    { value: 'healthy',   emoji: '🥗', label: 'Eigentlich esse ich normal',              desc: 'Aber das Gewicht steigt trotzdem' },
  ],
}
export default function Step9Nutrition({ onAnswer }) { return <ChoiceStep {...config} onAnswer={onAnswer} /> }

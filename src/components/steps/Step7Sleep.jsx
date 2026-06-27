import ChoiceStep from '../ChoiceStep'

const config = {
  heroImage: 'https://images.pexels.com/photos/7530370/pexels-photo-7530370.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
  heroAlt: 'Schlafender Mann',
  icon: '🌙',
  title: 'Wie gut schläfst du?',
  subtitle: 'Schlechter Schlaf ist einer der größten Dickmacher',
  options: [
    { value: 'good',  emoji: '😴', label: 'Ich schlafe gut durch',      desc: '7–8 Stunden, erholt aufwachen' },
    { value: 'wake',  emoji: '😵', label: 'Wache nachts oft auf',        desc: 'Toilettengänge, Grübeln, Schmerzen' },
    { value: 'tired', emoji: '🥱', label: 'Wache morgens gerädert auf',  desc: 'Nie wirklich ausgeschlafen' },
  ],
}
export default function Step7Sleep({ onAnswer }) { return <ChoiceStep {...config} onAnswer={onAnswer} /> }

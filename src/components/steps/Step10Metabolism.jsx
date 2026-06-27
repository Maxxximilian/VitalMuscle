import ChoiceStep from '../ChoiceStep'
const config = {
  heroImage: 'https://images.pexels.com/photos/8899516/pexels-photo-8899516.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop',
  heroAlt: 'Mann auf Waage',
  icon: '🔥', title: 'Wie schätzt du deinen Stoffwechsel ein?', subtitle: 'Deine Selbstwahrnehmung hilft uns beim Kalibrieren',
  options: [
    { value: 'slow',    emoji: '🐢', label: 'Gefühlt komplett eingeschlafen', desc: 'Ich nehme sofort zu, wenn ich nicht aufpasse' },
    { value: 'normal',  emoji: '⚖️', label: 'Normal für mein Alter',          desc: 'Ich kann mich einigermaßen einschätzen' },
    { value: 'unknown', emoji: '❓', label: 'Keine Ahnung',                   desc: 'Ich habe nie wirklich darauf geachtet' },
  ],
}
export default function Step10Metabolism({ onAnswer }) { return <ChoiceStep {...config} onAnswer={onAnswer} /> }

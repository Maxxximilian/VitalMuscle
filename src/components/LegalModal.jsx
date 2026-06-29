import { useEffect } from 'react'

const LEGAL = {
  impressum: {
    title: 'Impressum',
    content: `
<h2>Angaben gemäß § 5 TMG</h2>
<p><strong>Maximilian Adzabe</strong><br/>
Hagenbeckstraße 60<br/>
22527 Hamburg<br/>
Deutschland</p>

<h2>Kontakt</h2>
<p>E-Mail: <a href="mailto:hallo@vitalmuscle.de">hallo@vitalmuscle.de</a></p>

<h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
<p>Maximilian Adzabe<br/>
Hagenbeckstraße 60, 22527 Hamburg</p>

<h2>Umsatzsteuer</h2>
<p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:<br/>
DE369012103</p>

<h2>Streitschlichtung</h2>
<p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
<a href="https://ec.europa.eu/consumers/odr/" target="_blank">https://ec.europa.eu/consumers/odr/</a>.<br/>
Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
Verbraucherschlichtungsstelle teilzunehmen.</p>`,
  },

  datenschutz: {
    title: 'Datenschutzerklärung',
    content: `
<h2>1. Datenschutz auf einen Blick</h2>
<p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten
passiert, wenn Sie diese Website besuchen.</p>

<h2>2. Verantwortlicher</h2>
<p>Maximilian Adzabe<br/>Hagenbeckstraße 60, 22527 Hamburg<br/>E-Mail: hallo@vitalmuscle.de</p>

<h2>3. Welche Daten erheben wir?</h2>
<p><strong>Beim Kauf:</strong> Name, E-Mail-Adresse und Zahlungsdaten. Die Zahlungsabwicklung erfolgt
ausschließlich über Stripe Inc. – wir speichern keine Kreditkartendaten.</p>
<p><strong>Beim Besuch:</strong> IP-Adresse, Browser-Typ, besuchte Seiten, Uhrzeit (Server-Logs).</p>
<p><strong>Cookies:</strong> Wir verwenden notwendige Cookies sowie – nach Ihrer Einwilligung –
Analyse- und Marketing-Cookies (z.B. Meta Pixel).</p>

<h2>4. Wofür nutzen wir Ihre Daten?</h2>
<ul>
<li>Vertragserfüllung (Zugang zum gekauften Plan)</li>
<li>Versand des Zugangslinks per E-Mail</li>
<li>Verbesserung unseres Angebots</li>
<li>Marketing (nur mit Ihrer Einwilligung)</li>
</ul>

<h2>5. Ihre Rechte</h2>
<p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
Datenübertragbarkeit und Widerspruch. Kontakt: hallo@vitalmuscle.de</p>

<h2>6. Drittanbieter</h2>
<p><strong>Stripe Inc.</strong> (Zahlungsabwicklung) – Datenschutz: stripe.com/de/privacy<br/>
<strong>Resend Inc.</strong> (E-Mail-Versand) – Datenschutz: resend.com/legal/privacy-policy<br/>
<strong>Pexels</strong> (Bilder) – Datenschutz: pexels.com/privacy-policy</p>

<h2>7. Hosting</h2>
<p>Diese Website wird auf einem externen Server gehostet. Beim Aufruf der Website werden automatisch
Server-Logfiles erhoben, die Ihr Browser übermittelt (IP-Adresse, Browsertyp, Uhrzeit). Dies
dient der technischen Bereitstellung der Website (Art. 6 Abs. 1 lit. f DSGVO).</p>`,
  },

  agb: {
    title: 'Allgemeine Geschäftsbedingungen',
    content: `
<h2>§ 1 Geltungsbereich</h2>
<p>Diese AGB gelten für alle Verträge zwischen Maximilian Adzabe, Hagenbeckstraße 60,
22527 Hamburg (nachfolgend „Anbieter") und dem Kunden über den Erwerb digitaler
Fitnesspläne von VitalMuscle.</p>

<h2>§ 2 Vertragsgegenstand</h2>
<p>Der Anbieter stellt dem Kunden einen personalisierten digitalen Fitnessplan zur Verfügung.
Der Zugang erfolgt per persönlichem Zugangslink nach erfolgter Einmalzahlung. Es handelt sich
ausdrücklich um keine wiederkehrende Zahlung und kein Abonnement.</p>

<h2>§ 3 Vertragsschluss</h2>
<p>Der Vertrag kommt durch Abschluss des Bestellvorgangs und Bestätigung der Zahlung zustande.</p>

<h2>§ 4 Preise und Zahlung</h2>
<p>Alle Preise sind Endpreise und verstehen sich als Einmalzahlung inkl. 19% MwSt.</p>
<ul>
<li>1-Monats-Plan: 24,99 € (inkl. 3,99 € MwSt.)</li>
<li>3-Monats-Plan: 44,99 € (inkl. 7,18 € MwSt.)</li>
<li>6-Monats-Plan: 59,99 € (inkl. 9,58 € MwSt.)</li>
</ul>
<p>Die Zahlung erfolgt sicher über Stripe Inc. Der Zugangslink wird unmittelbar nach
Zahlungseingang per E-Mail zugestellt.</p>

<h2>§ 5 Widerruf</h2>
<p>Verbrauchern steht ein gesetzliches Widerrufsrecht zu. Details siehe Widerrufsbelehrung.<br/>
Das Widerrufsrecht erlischt bei digitalen Inhalten, wenn der Anbieter mit der Ausführung
begonnen hat und der Verbraucher ausdrücklich zugestimmt hat, dass er sein Widerrufsrecht verliert.</p>

<h2>§ 6 Haftungsausschluss</h2>
<p>Die Inhalte von VitalMuscle ersetzen keine ärztliche Beratung. Bei gesundheitlichen Problemen
konsultieren Sie bitte einen Arzt, bevor Sie mit dem Training beginnen.</p>

<h2>§ 7 Schlussbestimmungen</h2>
<p>Es gilt deutsches Recht. Gerichtsstand ist Hamburg.</p>`,
  },

  widerruf: {
    title: 'Widerrufsbelehrung',
    content: `
<h2>Widerrufsrecht</h2>
<p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>

<h2>Erlöschen des Widerrufsrechts bei digitalen Inhalten</h2>
<p><strong>Das Widerrufsrecht erlischt vorzeitig</strong>, wenn der Anbieter mit der Ausführung des
Vertrages begonnen hat und Sie vor Beginn der Ausführung ausdrücklich zugestimmt haben, dass der
Anbieter mit der Ausführung vor Ablauf der Widerrufsfrist beginnt, und Sie Ihre Kenntnis davon
bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Ausführung Ihr Widerrufsrecht verlieren
(§ 356 Abs. 5 BGB).</p>
<p>Da der Zugangslink zu Ihrem VitalMuscle-Plan unmittelbar nach Zahlung bereitgestellt wird und Sie
beim Kauf dieser Bereitstellung ausdrücklich zugestimmt haben, <strong>erlischt das Widerrufsrecht
mit Zugang des Links.</strong></p>

<h2>Ausübung des Widerrufsrechts (falls anwendbar)</h2>
<p>Um Ihr Widerrufsrecht auszuüben, informieren Sie uns per E-Mail:</p>
<p><strong>Maximilian Adzabe</strong><br/>Hagenbeckstraße 60<br/>22527 Hamburg<br/>
E-Mail: hallo@vitalmuscle.de</p>

<h2>Folgen des Widerrufs</h2>
<p>Wenn Sie diesen Vertrag wirksam widerrufen, haben wir Ihnen alle Zahlungen unverzüglich und
spätestens binnen vierzehn Tagen zurückzuzahlen.</p>

<h2>Muster-Widerrufsformular</h2>
<p>An: Maximilian Adzabe, Hagenbeckstraße 60, 22527 Hamburg, hallo@vitalmuscle.de<br/><br/>
Hiermit widerrufe ich den von mir abgeschlossenen Vertrag über den Kauf des folgenden
digitalen Produkts: _______________<br/><br/>
Bestellt am: _______________<br/>
Name: _______________<br/>
Datum: _______________</p>`,
  },
}

export default function LegalModal({ page, onClose }) {
  const content = LEGAL[page]

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!content) return null

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white sticky top-0">
        <h1 className="font-extrabold text-gray-900">{content.title}</h1>
        <button onClick={onClose} className="text-gray-500 text-2xl leading-none">×</button>
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-y-auto px-4 py-5 max-w-lg mx-auto w-full text-sm text-gray-700 leading-relaxed legal-content"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
    </div>
  )
}

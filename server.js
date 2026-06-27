import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { randomUUID } from 'crypto'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const DB_PATH = join(__dir, 'data', 'customers.json')

const stripe  = new Stripe(process.env.STRIPE_SECRET_KEY)
const resend  = new Resend(process.env.RESEND_API_KEY)
const app     = express()
const PORT    = process.env.PORT || 3001
const SITE    = process.env.FRONTEND_URL || 'http://localhost:5173'

// ── Einfache JSON-Datenbank ────────────────────────────────────────────────
function readDB() {
  if (!existsSync(DB_PATH)) return []
  try { return JSON.parse(readFileSync(DB_PATH, 'utf8')) } catch { return [] }
}
function saveDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}
function addCustomer(record) {
  const db = readDB()
  db.push(record)
  saveDB(db)
}
function findByToken(token) {
  return readDB().find(c => c.token === token)
}

// ── Abo-Pläne ──────────────────────────────────────────────────────────────
const PLANS = {
  '1m': { name: 'VitalMuscle Basis',        amount: 2499 },
  '3m': { name: 'VitalMuscle Empfohlen',    amount: 4499 },
  '6m': { name: 'VitalMuscle Bester Wert',  amount: 5999 },
}

// ── E-Mail-Template ────────────────────────────────────────────────────────
const PLAN_DURATIONS = { '1m': '4 Wochen', '3m': '12 Wochen (3 Monate)', '6m': '24 Wochen (6 Monate)' }

function buildEmail(accessUrl, planName, planId) {
  const duration = PLAN_DURATIONS[planId] || '4 Wochen'
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">

        <!-- Header -->
        <tr><td style="background:#16a34a;padding:32px 32px 24px;text-align:center">
          <p style="color:#fff;font-size:28px;margin:0 0 4px">💪</p>
          <h1 style="color:#fff;font-size:22px;font-weight:800;margin:0">VitalMuscle</h1>
          <p style="color:#bbf7d0;font-size:13px;margin:8px 0 0">Dein persönlicher Fitnessplan ab 35</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px">
          <h2 style="color:#111827;font-size:20px;font-weight:800;margin:0 0 8px">
            🎉 Zahlung erfolgreich – dein Plan wartet!
          </h2>
          <p style="color:#6b7280;font-size:15px;line-height:1.6;margin:0 0 24px">
            Herzlichen Glückwunsch! Du hast dir den <strong>${planName}</strong> gesichert.<br>
            Klicke auf den Button unten, um deinen persönlichen Plan zu öffnen.
          </p>

          <!-- CTA Button -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:0 0 24px">
              <a href="${accessUrl}"
                 style="display:inline-block;background:#16a34a;color:#fff;font-weight:800;font-size:16px;
                        text-decoration:none;padding:16px 40px;border-radius:12px;letter-spacing:.3px">
                🔓 Meinen Plan jetzt öffnen
              </a>
            </td></tr>
          </table>

          <!-- Infos -->
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:16px;margin:0 0 24px">
            <p style="color:#15803d;font-size:13px;font-weight:700;margin:0 0 8px">Was dich erwartet:</p>
            <ul style="color:#166534;font-size:13px;margin:0;padding:0 0 0 16px;line-height:1.8">
              <li>${duration} Trainingsplan (15 Min/Tag, zuhause)</li>
              <li>Gelenkschonende Übungen – kein Fitnessstudio nötig</li>
              <li>Persönlicher Ernährungsplan</li>
              <li>Übungsbibliothek mit Schritt-für-Schritt-Anleitungen</li>
            </ul>
          </div>

          <p style="color:#9ca3af;font-size:12px;line-height:1.6;margin:0">
            Speichere diesen Link als Lesezeichen – das ist dein dauerhafter Zugang.<br>
            Bei Fragen: <a href="mailto:hallo@vitalmuscle.de" style="color:#16a34a">hallo@vitalmuscle.de</a>
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="color:#9ca3af;font-size:11px;margin:0">
            VitalMuscle · Einmalzahlung, kein Abo.<br>
            Bei Fragen: <a href="mailto:hallo@vitalmuscle.de" style="color:#9ca3af">hallo@vitalmuscle.de</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── Middleware ─────────────────────────────────────────────────────────────
app.use(cors({ origin: SITE }))

// Webhook braucht raw body – MUSS vor express.json() kommen
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig    = req.headers['stripe-signature']
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, secret)
  } catch (err) {
    console.error('Webhook Signatur-Fehler:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    if (session.payment_status !== 'paid') return res.json({ received: true })

    const email      = session.customer_details?.email
    const planId     = session.metadata?.planId     || '3m'
    const commitment = session.metadata?.commitment || 'weekly'
    const token      = randomUUID()
    const plan       = PLANS[planId]

    // Kunde in DB speichern
    addCustomer({ token, email, planId, commitment, planName: plan.name, paidAt: new Date().toISOString(), sessionId: session.id })

    // Magic-Link-E-Mail versenden
    const accessUrl = `${SITE}/success?token=${token}`
    try {
      await resend.emails.send({
        from:    `${process.env.SENDER_NAME || 'VitalMuscle'} <${process.env.SENDER_EMAIL || 'onboarding@resend.dev'}>`,
        to:      email,
        subject: '💪 Dein VitalMuscle ist bereit – hier ist dein Zugangslink',
        html:    buildEmail(accessUrl, plan.name, planId),
      })
      console.log(`✅ Magic-Link-E-Mail gesendet an ${email}`)
    } catch (mailErr) {
      console.error('E-Mail-Fehler:', mailErr.message)
    }
  }

  res.json({ received: true })
})

app.use(express.json())

// POST /api/checkout
app.post('/api/checkout', async (req, res) => {
  try {
    const { planId } = req.body
    const plan = PLANS[planId]
    if (!plan) return res.status(400).json({ error: 'Unbekannter Plan' })

    const commitment = ['daily', 'weekly', 'nutrition'].includes(req.body.commitment) ? req.body.commitment : 'weekly'
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: plan.name,
            description: 'Gelenkschonender Fitnessplan für Männer ab 35 – täglich 15 Minuten, zuhause',
          },
          unit_amount: plan.amount,
        },
        quantity: 1,
      }],
      success_url: `${SITE}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${SITE}/?cancelled=true`,
      locale: 'de',
      metadata: { planId, commitment },
    })
    res.json({ url: session.url })
  } catch (err) {
    console.error('Stripe Fehler:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/verify-token
app.get('/api/verify-token', (req, res) => {
  const customer = findByToken(req.query.token)
  if (!customer) return res.status(404).json({ valid: false })
  res.json({ valid: true, email: customer.email, planId: customer.planId, commitment: customer.commitment || 'weekly' })
})

// GET /api/verify-session (Fallback wenn Webhook noch nicht gefeuert hat)
app.get('/api/verify-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.id)
    res.json({ paid: session.payment_status === 'paid', planId: session.metadata?.planId, commitment: session.metadata?.commitment || 'weekly' })
  } catch { res.status(400).json({ paid: false }) }
})

app.listen(PORT, () => console.log(`✅ VitalMuscle Server läuft auf http://localhost:${PORT}`))

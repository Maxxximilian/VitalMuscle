import { useState, useMemo } from 'react'

// ── Übungsbibliothek mit Bildern ───────────────────────────────────────────
const EXERCISES_LIB = [
  {
    name: 'Stuhlkniebeugen', muscle: 'Oberschenkel, Gesäß', joint: '🦵 Knie-schonend', icon: '🪑',
    image: 'https://images.pexels.com/photos/8899512/pexels-photo-8899512.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    how: 'Stehe vor einem Stuhl, Füße hüftbreit. Langsam senken als würdest du dich setzen, kurz über dem Sitz stoppen, wieder aufstehen. Rücken gerade halten.',
  },
  {
    name: 'Wand-Liegestütze', muscle: 'Brust, Schultern, Trizeps', joint: '💪 Schulter-schonend', icon: '🧱',
    image: 'https://images.pexels.com/photos/4720311/pexels-photo-4720311.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    how: 'Hände schulterbreit an der Wand. Ellbogen nah am Körper, langsam zur Wand lehnen (3 Sek.), zurückdrücken. Je weiter die Füße von der Wand, desto schwerer.',
  },
  {
    name: 'Waden-Heben', muscle: 'Waden, Unterschenkel', joint: '✅ Sehr sanft', icon: '🦶',
    image: 'https://images.pexels.com/photos/4720280/pexels-photo-4720280.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    how: 'Stehe aufrecht, Hände an der Wand oder Stuhl. Auf Zehenspitzen heben, oben kurz halten, langsam absenken. Volle Bewegungsreichweite nutzen.',
  },
  {
    name: 'Hüftheben (Brücke)', muscle: 'Gesäß, unterer Rücken', joint: '🔙 Rücken-schonend', icon: '🛏️',
    image: 'https://images.pexels.com/photos/6975783/pexels-photo-6975783.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    how: 'Auf dem Rücken liegend, Knie gebeugt, Füße flach am Boden. Hüfte hochdrücken bis Körper eine gerade Linie bildet, 1–2 Sek. halten, langsam absenken.',
  },
  {
    name: 'Marschieren auf der Stelle', muscle: 'Ganzkörper-Aktivierung', joint: '✅ Sehr sanft', icon: '🚶',
    image: 'https://images.pexels.com/photos/6339342/pexels-photo-6339342.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    how: 'Aufrecht stehen, abwechselnd Knie in Hüfthöhe heben. Arme mitschwingen wie beim echten Gehen. Tempo nach Belieben anpassen.',
  },
  {
    name: 'Schulterblatt-Squeeze', muscle: 'Oberer Rücken, Schultern', joint: '💆 Nacken-schonend', icon: '🎯',
    image: 'https://images.pexels.com/photos/8413737/pexels-photo-8413737.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    how: 'Aufrecht sitzen oder stehen. Schulterblätter zusammenziehen als würdest du einen Bleistift festhalten. 3 Sekunden halten, dann loslassen. Schultern dabei unten lassen.',
  },
  {
    name: 'Seitwärtsschritte', muscle: 'Oberschenkel-Außenseite, Gesäß', joint: '🦵 Knie-schonend', icon: '↔️',
    image: 'https://images.pexels.com/photos/7870240/pexels-photo-7870240.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    how: 'Leicht in die Knie gehen. Schritte zur Seite machen, Knie dabei nicht nach innen fallen lassen. Gleichmäßiges Tempo, beide Seiten gleich viel.',
  },
  {
    name: 'Katze-Kuh (Stuhl)', muscle: 'Wirbelsäule, Core', joint: '🔙 Rücken-mobilisierend', icon: '🐱',
    image: 'https://images.pexels.com/photos/6926051/pexels-photo-6926051.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
    how: 'Aufrecht auf Stuhlkante sitzen. Beim Einatmen Brust vorwölben, Rücken hohl (Kuh-Position). Beim Ausatmen Rücken runden, Kinn zur Brust (Katze). Fließend wiederholen.',
  },
]

// ── Quiz-Antworten aus localStorage ──────────────────────────────────────
function getAnswers() {
  try { return JSON.parse(localStorage.getItem('vp_answers') || '{}') } catch { return {} }
}

// ── Kalorienberechnung (Mifflin-St Jeor) ─────────────────────────────────
function calcCalories(a) {
  const AGE_MAP  = { '35-44': 39, '45-54': 49, '55-64': 59, '65+': 68 }
  const ACT_MAP  = { sedentary: 1.2, standing: 1.375, walking: 1.55, active: 1.725 }
  const weight   = a?.body?.currentWeight || 88
  const height   = a?.body?.height        || 175
  const target   = a?.body?.targetWeight  || 78
  const age      = AGE_MAP[a?.age]        || 50
  const act      = ACT_MAP[a?.activity]   || 1.2
  const bmr      = Math.round(10 * weight + 6.25 * height - 5 * age + 5)
  const tdee     = Math.round(bmr * act)
  const goal     = Math.round(tdee - 400)
  const protein  = Math.round(weight * 1.6)
  return { bmr, tdee, goal, protein, weight, target }
}

// ── Übungs-Tiers [leicht / mittel / intensiv] ────────────────────────────
const EX = {
  squat:    [['2 × 10','langsam, kontrolliert'],  ['3 × 15','explosiv aufstehen'], ['4 × 20','Pause 20 Sek.']],
  wall:     [['2 × 8', 'Füße hüftbreit'],         ['3 × 12','Füße weiter weg'],    ['4 × 15','3s runter, 1s hoch']],
  calf:     [['2 × 15','an der Wand halten'],      ['3 × 20','3s langsam runter'],  ['4 × 25','einbeinig']],
  bridge:   [['2 × 12','1 Sek. oben halten'],      ['3 × 15','2 Sek. oben halten'],['4 × 20','pulsieren oben']],
  march:    [['2 Min', 'Knie hochziehen'],          ['3 Min', 'Arme aktiv'],         ['3 Min', 'Höchsttempo']],
  shoulder: [['2 × 10','3 Sek. halten'],           ['3 × 12','langsam und bewusst'],['4 × 15','maximale Spannung']],
  side:     [['2 × 15','leicht in die Knie'],      ['3 × 20','tiefer gehen'],       ['4 × 25','maximale Tiefe']],
  cat:      [['2 × 10','fließend atmen'],           ['3 × 12','langsam ausführen'],  ['3 × 15','voll mobilisieren']],
}
const tier = p => (p <= 2 ? 0 : p <= 4 ? 1 : 2)

function getDailyDays(phase) {
  const t = tier(phase)
  return [
    { label: 'Unterkörper 🦵', duration: '15 Min', exercises: [
      { name: 'Marschieren auf der Stelle', sets: EX.march[t][0],    note: EX.march[t][1] },
      { name: 'Stuhlkniebeugen',            sets: EX.squat[t][0],    note: EX.squat[t][1] },
      { name: 'Waden-Heben',                sets: EX.calf[t][0],     note: EX.calf[t][1]  },
      { name: 'Hüftheben (Brücke)',         sets: EX.bridge[t][0],   note: EX.bridge[t][1]},
      { name: 'Seitwärtsschritte',          sets: EX.side[t][0],     note: EX.side[t][1]  },
    ]},
    { label: 'Oberkörper 💪', duration: '15 Min', exercises: [
      { name: 'Schulterkreisen',            sets: '2 × 15',          note: 'Beide Richtungen' },
      { name: 'Wand-Liegestütze',           sets: EX.wall[t][0],     note: EX.wall[t][1]  },
      { name: 'Schulterblatt-Squeeze',      sets: EX.shoulder[t][0], note: EX.shoulder[t][1]},
      { name: 'Nackendehnung',              sets: '30s / Seite',     note: 'Ohr zur Schulter' },
      { name: 'Armkreisen',                 sets: '2 × 15',          note: 'Klein & groß' },
    ]},
    { label: 'Core & Mobilität 🧘', duration: '15 Min', exercises: [
      { name: 'Katze-Kuh (Stuhl)',          sets: EX.cat[t][0],      note: EX.cat[t][1]   },
      { name: 'Hüftkreisen (stehend)',      sets: '2 × 10',          note: 'Beide Richtungen' },
      { name: 'Seitliche Rumpfdehnung',     sets: '2 × 30s/Seite',  note: 'Arm über Kopf' },
      { name: 'Brustöffner (stehend)',      sets: '3 × 30s',         note: 'Arme nach hinten' },
      { name: 'Tiefenatmung',              sets: '5 ×',              note: '4s ein, 6s aus' },
    ]},
    { label: 'Ausdauer 🏃', duration: '15 Min', exercises: [
      { name: 'Marschieren auf der Stelle', sets: EX.march[t][0],    note: 'Maximales Tempo'  },
      { name: 'Stuhlkniebeugen',            sets: EX.squat[t][0],    note: 'Kein Stopp'       },
      { name: 'Seitwärtsschritte',          sets: EX.side[t][0],     note: 'Durchhalten'      },
      { name: 'Waden-Heben',               sets: EX.calf[t][0],     note: 'Kontinuierlich'   },
      { name: 'Cool-Down Dehnen',          sets: '3 Min',            note: '30s pro Muskel'   },
    ]},
    { label: 'Ganzkörper 💥', duration: '15 Min', exercises: [
      { name: 'Marschieren (Aufwärmen)',    sets: '2 Min',            note: 'Langsam starten'  },
      { name: 'Stuhlkniebeugen',            sets: EX.squat[t][0],    note: EX.squat[t][1]    },
      { name: 'Wand-Liegestütze',          sets: EX.wall[t][0],     note: EX.wall[t][1]     },
      { name: 'Hüftheben (Brücke)',        sets: EX.bridge[t][0],   note: EX.bridge[t][1]   },
      { name: 'Schulterblatt-Squeeze',     sets: EX.shoulder[t][0], note: EX.shoulder[t][1] },
    ]},
  ]
}

function getWeeklyDays(phase) {
  const t = tier(phase)
  return [
    { label: 'Mobilisation & Kraft 🔥', duration: '20 Min', exercises: [
      { name: 'Marschieren auf der Stelle', sets: EX.march[t][0],    note: EX.march[t][1]    },
      { name: 'Stuhlkniebeugen',            sets: EX.squat[t][0],    note: EX.squat[t][1]    },
      { name: 'Wand-Liegestütze',          sets: EX.wall[t][0],     note: EX.wall[t][1]     },
      { name: 'Hüftheben (Brücke)',        sets: EX.bridge[t][0],   note: EX.bridge[t][1]   },
      { name: 'Waden-Heben',              sets: EX.calf[t][0],     note: EX.calf[t][1]     },
    ]},
    { label: 'Dehnung & Ausdauer 🧘', duration: '20 Min', exercises: [
      { name: 'Katze-Kuh (Stuhl)',         sets: EX.cat[t][0],      note: EX.cat[t][1]      },
      { name: 'Schulterblatt-Squeeze',     sets: EX.shoulder[t][0], note: EX.shoulder[t][1] },
      { name: 'Seitwärtsschritte',         sets: EX.side[t][0],     note: EX.side[t][1]     },
      { name: 'Seitliche Rumpfdehnung',    sets: '2 × 30s/Seite',  note: 'Arm über Kopf'   },
      { name: 'Tiefenatmung',             sets: '5 ×',             note: '4s ein, 6s aus'  },
    ]},
    { label: 'Ganzkörper 💥', duration: '20 Min', exercises: [
      { name: 'Marschieren (Aufwärmen)',   sets: '2 Min',            note: 'Langsam starten'  },
      { name: 'Stuhlkniebeugen',           sets: EX.squat[t][0],    note: EX.squat[t][1]    },
      { name: 'Wand-Liegestütze',         sets: EX.wall[t][0],     note: EX.wall[t][1]     },
      { name: 'Hüftheben (Brücke)',       sets: EX.bridge[t][0],   note: EX.bridge[t][1]   },
      { name: 'Schulterblatt-Squeeze',    sets: EX.shoulder[t][0], note: EX.shoulder[t][1] },
    ]},
  ]
}

const PHASE_META = [
  { name: 'Grundlage', color: 'bg-blue-50 border-blue-200',    badge: 'bg-blue-100 text-blue-700'    },
  { name: 'Aufbau',    color: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' },
  { name: 'Kraft',     color: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  { name: 'Ausdauer',  color: 'bg-red-50 border-red-200',      badge: 'bg-red-100 text-red-700'      },
  { name: 'Intensiv',  color: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  { name: 'Peak',      color: 'bg-brand-50 border-brand-200',  badge: 'bg-brand-100 text-brand-700'  },
]

function generateWeeks(planId, commitment) {
  const numMonths = planId === '6m' ? 6 : planId === '3m' ? 3 : 1
  const DN_DAILY  = ['Mo','Di','Mi','Do','Fr']
  const DN_WEEKLY = ['Mo','Mi','Fr']
  const weeks = []
  let n = 0
  for (let phase = 1; phase <= numMonths; phase++) {
    const meta  = PHASE_META[phase - 1]
    const tmpl  = commitment === 'daily' ? getDailyDays(phase) : getWeeklyDays(phase)
    const names = commitment === 'daily' ? DN_DAILY : DN_WEEKLY
    for (let w = 1; w <= 4; w++) {
      n++
      weeks.push({
        week: n,
        title: `Woche ${n}`,
        subtitle: `Phase ${phase} – ${meta.name}`,
        color: meta.color,
        badge: meta.badge,
        days: tmpl.map((dt, i) => ({
          day: `Tag ${i + 1} (${names[i]})`,
          focus: dt.label,
          duration: dt.duration,
          exercises: dt.exercises,
        })),
      })
    }
  }
  return weeks
}

// ── Statischer Trainingsplan-Fallback (wenn kein planId bekannt) ───────────
const WEEKS = [
  {
    week: 1, title: 'Woche 1 – Grundlage', subtitle: 'Sanft einsteigen, Körper aktivieren',
    color: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700',
    days: [
      { day: 'Tag 1 (Mo)', focus: 'Mobilisation', duration: '15 Min',
        exercises: [
          { name: 'Schulterkreisen',         sets: '2 × 10',  note: 'Beide Richtungen, langsam' },
          { name: 'Hüftkreisen (stehend)',   sets: '2 × 10',  note: 'Hände an der Hüfte' },
          { name: 'Stuhlkniebeugen',         sets: '2 × 10',  note: 'Langsam rein und raus' },
          { name: 'Wand-Liegestütze',        sets: '2 × 8',   note: 'Füße hüftbreit, Körper gerade' },
          { name: 'Waden-Heben',             sets: '2 × 15',  note: 'An der Wand festhalten' },
        ],
      },
      { day: 'Tag 2 (Mi)', focus: 'Dehnung & Atmung', duration: '15 Min',
        exercises: [
          { name: 'Brustöffner (stehend)',   sets: '3 × 30s', note: 'Arme nach hinten, tief einatmen' },
          { name: 'Seitliche Rumpfdehnung',  sets: '2 × 30s/Seite', note: 'Arm über Kopf, sanft zur Seite' },
          { name: 'Katze-Kuh (Stuhl)',       sets: '2 × 10',  note: 'Rücken runden und strecken' },
          { name: 'Schulterblatt-Squeeze',   sets: '3 × 10',  note: '3 Sek. halten' },
          { name: 'Tiefenatmung',            sets: '5 Atemzüge', note: '4s ein, 6s aus – entspannen' },
        ],
      },
      { day: 'Tag 3 (Fr)', focus: 'Leichte Kraft', duration: '15 Min',
        exercises: [
          { name: 'Marschieren auf der Stelle', sets: '2 Min', note: 'Knie etwas hochziehen' },
          { name: 'Stuhlkniebeugen',         sets: '3 × 12',  note: 'Langsam, kontrolliert' },
          { name: 'Wand-Liegestütze',        sets: '3 × 10',  note: 'Körper gerade halten' },
          { name: 'Seitwärtsschritte',       sets: '2 × 20',  note: 'Leicht in die Knie gehen' },
          { name: 'Hüftheben (Brücke)',      sets: '2 × 12',  note: 'Oben 1 Sek. halten' },
        ],
      },
    ],
  },
  {
    week: 2, title: 'Woche 2 – Aufbau', subtitle: 'Intensität leicht erhöhen, Routine festigen',
    color: 'bg-yellow-50 border-yellow-200', badge: 'bg-yellow-100 text-yellow-700',
    days: [
      { day: 'Tag 1 (Mo)', focus: 'Unterkörper', duration: '15 Min',
        exercises: [
          { name: 'Marschieren auf der Stelle', sets: '2 Min', note: 'Tempo leicht erhöhen' },
          { name: 'Stuhlkniebeugen',         sets: '3 × 15',  note: 'Kurze Pause unten' },
          { name: 'Waden-Heben',             sets: '3 × 20',  note: '3 Sek. langsam runter' },
          { name: 'Seitwärtsschritte',       sets: '2 × 15',  note: 'Tiefer als letzte Woche' },
          { name: 'Hüftheben (Brücke)',      sets: '3 × 12',  note: 'Oben kurz halten' },
        ],
      },
      { day: 'Tag 2 (Mi)', focus: 'Oberkörper', duration: '15 Min',
        exercises: [
          { name: 'Schulterkreisen',         sets: '2 × 15',  note: 'Beide Richtungen' },
          { name: 'Wand-Liegestütze',        sets: '3 × 12',  note: 'Füße weiter von der Wand' },
          { name: 'Schulterblatt-Squeeze',   sets: '3 × 12',  note: '3 Sek. halten' },
          { name: 'Nackendehnung',           sets: '3 × 30s/Seite', note: 'Ohr zur Schulter, sanft' },
          { name: 'Armkreisen',              sets: '2 × 15',  note: 'Kleine & große Kreise' },
        ],
      },
      { day: 'Tag 3 (Fr)', focus: 'Ganzkörper', duration: '15 Min',
        exercises: [
          { name: 'Marschieren auf der Stelle', sets: '2 Min', note: 'Knie hoch, Arme aktiv' },
          { name: 'Stuhlkniebeugen',         sets: '3 × 12',  note: 'Explosiv aufstehen' },
          { name: 'Wand-Liegestütze',        sets: '3 × 10',  note: '3s runter, 1s hoch' },
          { name: 'Seitwärtsschritte',       sets: '3 × 20',  note: 'Mit Kniebeuge' },
          { name: 'Hüftheben (Brücke)',      sets: '3 × 15',  note: 'Volle Bewegung' },
        ],
      },
      { day: 'Bonus (Sa)', focus: 'Aktive Erholung', duration: '20 Min',
        exercises: [{ name: 'Spaziergang', sets: '20 Min', note: 'Zügiges Tempo – frische Luft' }],
      },
    ],
  },
  {
    week: 3, title: 'Woche 3 – Steigerung', subtitle: 'Schwierigkeit erhöhen, Ausdauer verbessern',
    color: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700',
    days: [
      { day: 'Tag 1 (Mo)', focus: 'Kraft', duration: '15 Min',
        exercises: [
          { name: 'Marschieren auf der Stelle', sets: '2 Min', note: 'Aufwärmen' },
          { name: 'Stuhlkniebeugen – langsam', sets: '4 × 12', note: '3s runter, 1s halten, 1s hoch' },
          { name: 'Einbein-Waden-Heben',     sets: '2 × 12/Seite', note: 'An Wand festhalten' },
          { name: 'Hüftheben (Brücke)',      sets: '3 × 15',  note: 'Oben 2 Sek. halten' },
          { name: 'Schulterblatt-Squeeze',   sets: '3 × 12',  note: 'Langsam und bewusst' },
        ],
      },
      { day: 'Tag 2 (Mi)', focus: 'Ausdauer', duration: '15 Min',
        exercises: [
          { name: 'Marschieren + Armbewegung', sets: '3 Min', note: 'Knie hoch, Ellbogen 90°' },
          { name: 'Stuhlkniebeugen',         sets: '3 × 15',  note: 'Kontinuierlich, kein Stopp' },
          { name: 'Seitwärtsschritte',       sets: '3 × 25',  note: 'Tempo erhöhen' },
          { name: 'Wand-Liegestütze',        sets: '3 × 15',  note: 'Gute Form hat Vorrang' },
          { name: 'Stretching',              sets: '3 Min',   note: '30s pro Muskelgruppe halten' },
        ],
      },
      { day: 'Tag 3 (Fr)', focus: 'Zirkel', duration: '15 Min',
        exercises: [
          { name: '3 Runden Zirkel (je ~3 Min)', sets: '—', note: '1 Min Pause zwischen Runden' },
          { name: '› Stuhlkniebeugen',       sets: '12 Wdh.', note: '' },
          { name: '› Wand-Liegestütze',      sets: '10 Wdh.', note: '' },
          { name: '› Waden-Heben',           sets: '15 Wdh.', note: '' },
          { name: 'Cool-Down Dehnen',        sets: '3 Min',   note: 'Oberschenkel, Wade, Schultern' },
        ],
      },
      { day: 'Bonus (Sa)', focus: 'Aktive Erholung', duration: '30 Min',
        exercises: [{ name: 'Zügiger Spaziergang', sets: '30 Min', note: 'Leichtes Schwitzen ist das Ziel' }],
      },
    ],
  },
  {
    week: 4, title: 'Woche 4 – Festigung', subtitle: 'Ergebnisse sichern, neue Gewohnheit verankern',
    color: 'bg-brand-50 border-brand-200', badge: 'bg-brand-100 text-brand-700',
    days: [
      { day: 'Tag 1 (Mo)', focus: 'Maximalkraft', duration: '15 Min',
        exercises: [
          { name: 'Marschieren auf der Stelle', sets: '2 Min', note: 'Zügig aufwärmen' },
          { name: 'Stuhlkniebeugen',         sets: '4 × 15',  note: 'So tief wie möglich' },
          { name: 'Hüftheben (Brücke)',      sets: '4 × 15',  note: 'Oben 2 Sek. halten' },
          { name: 'Wand-Liegestütze',        sets: '4 × 12',  note: 'Füße maximal weit weg' },
          { name: 'Schulterblatt-Squeeze',   sets: '3 × 15',  note: '3 Sek. halten' },
        ],
      },
      { day: 'Tag 2 (Mi)', focus: 'Ausdauer + Koordination', duration: '15 Min',
        exercises: [
          { name: 'Marschieren + Knieheben', sets: '3 Min',   note: 'Knie auf Hüfthöhe' },
          { name: 'Stuhlkniebeugen',         sets: '4 × 15',  note: 'Tempo leicht erhöhen' },
          { name: 'Seitwärtsschritte',       sets: '3 × 30s', note: 'Richtungswechsel bei jedem Schritt' },
          { name: 'Waden-Heben',             sets: '3 × 20',  note: 'Volle Bewegung, langsam runter' },
          { name: 'Tiefenatmung',            sets: '5 Min',   note: '4-7-8 Methode zum Abschluss' },
        ],
      },
      { day: 'Tag 3 (Fr)', focus: 'Großer Abschluss-Zirkel', duration: '15 Min',
        exercises: [
          { name: '4 Runden Zirkel (45s/15s)', sets: '—', note: '45s Arbeit, 15s Pause pro Übung' },
          { name: '› Stuhlkniebeugen',       sets: '45s',     note: '' },
          { name: '› Wand-Liegestütze',      sets: '45s',     note: '' },
          { name: '› Marschieren',           sets: '45s',     note: '' },
          { name: 'Cool-Down',               sets: '3 Min',   note: 'Vollständiges Stretching' },
        ],
      },
      { day: 'Tag 4 (So)', focus: '🎉 Erfolgs-Check', duration: '—',
        exercises: [
          { name: 'Gewicht messen (morgens, nüchtern)', sets: '—', note: 'Notiere die Veränderung' },
          { name: 'Energie-Level: 1–10 einschätzen',   sets: '—', note: 'Vergleiche mit Woche 1' },
          { name: 'Gelenkschmerzen besser?',            sets: '—', note: 'Dein Körper hat sich angepasst' },
        ],
      },
    ],
  },
]

// ── Ernährungsplan ─────────────────────────────────────────────────────────
const NUTRITION = {
  principles: [
    { icon: '🥩', title: 'Protein bei jeder Mahlzeit',  desc: 'Fleisch, Fisch, Eier – schützt Muskeln & sättigt länger' },
    { icon: '🥦', title: '50% des Tellers = Gemüse',     desc: 'Viel Volumen, wenig Kalorien – du isst satt und nimmst trotzdem ab' },
    { icon: '💧', title: 'Vor dem Essen Wasser trinken', desc: 'Ein Glas 15 Min vorher reduziert die Portion automatisch' },
    { icon: '🚫', title: 'Smarte Tausche statt Verzicht', desc: 'Weißbrot → Vollkorn · Limo → Wasser · Chips → Nüsse' },
    { icon: '⏰', title: 'Letzte Mahlzeit vor 19 Uhr',   desc: 'Gibt dem Stoffwechsel Ruhe und verbessert den Schlaf' },
  ],
  dayPlan: [
    { time: '7:00',  meal: 'Frühstück',          icon: '🌅', kcal: '~350 kcal',
      items: ['3 Rühreier mit Paprika', 'oder: Overnight Oats mit Beeren', '1 Glas Wasser + Kaffee ungesüßt'] },
    { time: '10:00', meal: 'Snack (optional)',    icon: '🍎', kcal: '~150 kcal',
      items: ['Handvoll Nüsse (Mandeln, Walnüsse)', 'oder: 1 Apfel'] },
    { time: '12:30', meal: 'Mittagessen',         icon: '☀️', kcal: '~500 kcal',
      items: ['150g Fleisch oder Fisch', 'Viel Gemüse (Brokkoli, Zucchini, Tomaten)', 'Kleine Portion Kartoffeln oder Reis'] },
    { time: '15:30', meal: 'Nachmittag',          icon: '🧀', kcal: '~200 kcal',
      items: ['200g Magerquark mit Zimt', 'oder: 2 Scheiben Vollkornbrot mit Frischkäse'] },
    { time: '18:30', meal: 'Abendessen (leicht)', icon: '🌙', kcal: '~350 kcal',
      items: ['Gemüsesuppe oder großer Salat', '100g Protein (Ei, Fisch, Hähnchen)', 'Kein Brot, keine Nudeln'] },
  ],
  tips: [
    'Koche 2× pro Woche größere Mengen und iss die Reste am nächsten Tag',
    'Kurkuma, Ingwer und Zimt wirken entzündungshemmend – gut für die Gelenke',
    'Alkohol max. 1–2 Gläser pro Woche – stoppt die Fettverbrennung für Stunden',
    'Gönne dir 1× pro Woche ein Lieblingsessen ohne schlechtes Gewissen',
  ],
}

const TABS = [
  { id: 'plan',      label: '📅 Trainingsplan' },
  { id: 'nutrition', label: '🍽️ Ernährung' },
  { id: 'exercises', label: '🏋️ Übungen' },
]

const PLAN_INFO = {
  '1m': { title: '1-Monats-Plan',  sub: '4 Wochen · 15 Min täglich · zuhause' },
  '3m': { title: '3-Monats-Plan',  sub: '12 Wochen · 15 Min täglich · zuhause' },
  '6m': { title: '6-Monats-Plan',  sub: '24 Wochen · 15 Min täglich · zuhause' },
}

export default function PlanPage({ planId, commitment: commitmentProp, onLegal }) {
  const info = PLAN_INFO[planId] || PLAN_INFO['1m']
  const [activeTab, setActiveTab]       = useState('plan')
  const [expandedWeek, setExpandedWeek] = useState(0)
  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vp_done') || '{}') } catch { return {} }
  })

  const answers    = useMemo(() => getAnswers(), [])
  const commitment = commitmentProp || answers?.commitment || 'weekly'
  const weeks      = useMemo(() => generateWeeks(planId || '1m', commitment), [planId, commitment])
  const cal        = useMemo(() => calcCalories(answers), [answers])

  const toggleDone = (key) => {
    setDone(prev => {
      const next = { ...prev, [key]: !prev[key] }
      localStorage.setItem('vp_done', JSON.stringify(next))
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header mit Bild */}
      <header className="relative text-white overflow-hidden">
        <img
          src="https://images.pexels.com/photos/6972651/pexels-photo-6972651.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop"
          alt="Älterer Mann beim Heimtraining"
          className="w-full h-48 object-cover object-center"
          onError={e => { e.target.style.display = 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-700/90 via-brand-600/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-5 max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">💪</span>
            <span className="font-extrabold">VitalMuscle</span>
          </div>
          <h1 className="text-2xl font-extrabold leading-tight">Dein {info.title}</h1>
          <p className="text-brand-100 text-sm">{info.sub}</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-lg mx-auto flex">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-xs font-bold whitespace-nowrap px-2 border-b-2 transition-colors
                ${activeTab === tab.id ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-400'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-4 py-5 pb-20">

        {/* ── TRAININGSPLAN ── */}
        {activeTab === 'plan' && (
          <div className="space-y-4">
            {weeks.map((week, wi) => (
              <div key={wi} className={`border-2 rounded-2xl overflow-hidden ${week.color}`}>
                <button onClick={() => setExpandedWeek(expandedWeek === wi ? -1 : wi)}
                  className="w-full flex items-center justify-between p-4 text-left">
                  <div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${week.badge} mr-2`}>
                      {week.title}
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">{week.subtitle}</p>
                  </div>
                  <span className={`text-gray-400 text-xl transition-transform ${expandedWeek === wi ? 'rotate-180' : ''}`}>▾</span>
                </button>

                {expandedWeek === wi && (
                  <div className="px-4 pb-4 space-y-3">
                    {week.days.map((d, di) => {
                      const key = `w${wi}d${di}`
                      return (
                        <div key={di} className="bg-white rounded-xl shadow-sm overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
                            <div>
                              <span className="font-bold text-gray-900 text-sm">{d.day}</span>
                              <span className="text-xs text-gray-400 ml-2">{d.focus} · {d.duration}</span>
                            </div>
                            <button onClick={() => toggleDone(key)}
                              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-sm transition-all
                                ${done[key] ? 'bg-brand-600 border-brand-600 text-white' : 'border-gray-300 text-gray-300'}`}>
                              {done[key] ? '✓' : '○'}
                            </button>
                          </div>
                          <div className="p-3 space-y-1.5">
                            {d.exercises.map((ex, ei) => (
                              <div key={ei} className="flex gap-2 text-xs">
                                <span className="text-gray-400 w-20 shrink-0 font-semibold tabular-nums">{ex.sets}</span>
                                <div>
                                  <span className="font-semibold text-gray-800">{ex.name}</span>
                                  {ex.note && <span className="text-gray-400"> – {ex.note}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── ERNÄHRUNG ── */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6">

            {/* Personalisierte Kalorienkarte */}
            <div className="bg-brand-600 rounded-2xl p-4 text-white">
              <p className="text-brand-100 text-xs font-semibold uppercase tracking-wide mb-1">Dein persönliches Tagesziel</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-extrabold">{cal.goal}</span>
                <span className="text-brand-200 text-sm">kcal / Tag</span>
              </div>
              <p className="text-brand-200 text-xs mb-3">
                Dein Verbrauch ({cal.tdee} kcal) minus 400 kcal Defizit = ca. 1,5 kg Fettverlust pro Monat
              </p>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="bg-white/15 rounded-xl py-2 px-1">
                  <p className="text-white font-extrabold text-lg">{cal.protein}g</p>
                  <p className="text-brand-100 text-xs">Protein / Tag (Muskeln schützen)</p>
                </div>
                <div className="bg-white/15 rounded-xl py-2 px-1">
                  <p className="text-white font-extrabold text-lg">~{Math.round((cal.weight - cal.target) / 1.5)} Mon.</p>
                  <p className="text-brand-100 text-xs">bis Zielgewicht ({cal.target} kg)</p>
                </div>
              </div>
              <p className="text-brand-200 text-xs mt-2 text-center">
                400 kcal/Tag Defizit ist sanft, sicher & langfristig haltbar – kein Hungern.
              </p>
            </div>

            <div>
              <h2 className="font-extrabold text-gray-900 text-lg mb-3">Die 5 Grundregeln</h2>
              <div className="space-y-3">
                {NUTRITION.principles.map((p, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 flex gap-3 shadow-sm border border-gray-100">
                    <span className="text-2xl shrink-0">{p.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{p.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-extrabold text-gray-900 text-lg mb-3">Beispiel-Tag</h2>
              <div className="space-y-3">
                {NUTRITION.dayPlan.map((m, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{m.icon}</span>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{m.meal}</p>
                          <p className="text-xs text-gray-400">{m.time} Uhr</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">{m.kcal}</span>
                    </div>
                    <ul className="space-y-0.5">
                      {m.items.map((it, j) => (
                        <li key={j} className="text-xs text-gray-600 flex gap-1.5">
                          <span className="text-brand-500 shrink-0">›</span>{it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-extrabold text-gray-900 text-lg mb-3">Profi-Tipps</h2>
              <div className="space-y-2">
                {NUTRITION.tips.map((t, i) => (
                  <div key={i} className="bg-brand-50 border border-brand-100 rounded-xl p-3 text-sm text-brand-800">
                    💡 {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ÜBUNGEN ── */}
        {activeTab === 'exercises' && (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 text-center mb-3">
              Alle Übungen für zuhause – kein Gerät nötig
            </p>
            {EXERCISES_LIB.map((ex, i) => (
              <details key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm group overflow-hidden">
                <summary className="flex items-center gap-3 p-4 cursor-pointer list-none">
                  <span className="text-3xl shrink-0 leading-none">{ex.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">{ex.name}</p>
                    <p className="text-xs text-gray-500">{ex.muscle}</p>
                    <span className="inline-block mt-1 text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                      {ex.joint}
                    </span>
                  </div>
                  <span className="text-gray-300 group-open:rotate-180 transition-transform text-lg shrink-0">▾</span>
                </summary>

                <div className="border-t border-gray-100">
                  {/* Übungsbild */}
                  <img
                    src={ex.image}
                    alt={ex.name}
                    className="w-full h-44 object-cover"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  <div className="p-4">
                    <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">So geht's:</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{ex.how}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}

        {/* Legal-Links unten im Plan */}
        <div className="mt-10 pt-5 border-t border-gray-200 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {[['impressum','Impressum'],['datenschutz','Datenschutz'],['agb','AGB'],['widerruf','Widerruf']].map(([key, label]) => (
            <button key={key} onClick={() => onLegal?.(key)}
              className="text-xs text-gray-400 hover:text-gray-600 underline">
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

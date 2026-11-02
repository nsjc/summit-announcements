// Mock data for Summit Retail Group: 5 stores x 40 people (1 manager + 39 employees each).

export const STORES = [
  { id: 'denver', name: 'Downtown Denver' },
  { id: 'boulder', name: 'Boulder' },
  { id: 'fortcollins', name: 'Fort Collins' },
  { id: 'springs', name: 'Colorado Springs' },
  { id: 'aurora', name: 'Aurora' },
]

const FIRST = [
  'Jordan', 'Maria', 'Aisha', 'Daniel', 'Priya', 'Marcus', 'Emily', 'Carlos', 'Hannah', 'Kevin',
  'Sofia', 'Tyler', 'Grace', 'Andre', 'Lily', 'Omar', 'Rachel', 'Ethan', 'Mei', 'Luis',
  'Natalie', 'Brandon', 'Chloe', 'Jamal', 'Olivia', 'Ryan', 'Fatima', 'Noah', 'Jasmine', 'Caleb',
  'Ava', 'Diego', 'Megan', 'Samuel', 'Zoe', 'Isaac', 'Leah', 'Victor', 'Nina', 'Owen',
]

const LAST = [
  'Lee', 'Garcia', 'Patel', 'Nguyen', 'Johnson', 'Martinez', 'Kim', 'Brown', 'Davis', 'Lopez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Thompson', 'White', 'Harris',
  'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright',
  'Scott', 'Torres', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera',
]

const TITLES = [
  'Sales Associate', 'Cashier', 'Sales Associate', 'Stock Associate', 'Customer Service',
  'Sales Associate', 'Cashier', 'Shift Lead', 'Visual Merchandiser', 'Stock Associate',
]

export const PEOPLE = Array.from({ length: 200 }, (_, i) => {
  const storeIndex = Math.floor(i / 40)
  const isManager = i % 40 === 0
  // Offsetting the last name by store keeps all 200 names unique.
  const first = FIRST[i % 40]
  const last = LAST[(i % 40 + storeIndex * 7) % 40]
  return {
    id: `p${i + 1}`,
    name: `${first} ${last}`,
    storeId: STORES[storeIndex].id,
    role: isManager ? 'manager' : 'employee',
    title: isManager ? 'Store Manager' : TITLES[i % TITLES.length],
  }
})

export const MANAGERS = PEOPLE.filter((p) => p.role === 'manager')
export const EMPLOYEES = PEOPLE.filter((p) => p.role === 'employee')

export const storeById = (id) => STORES.find((s) => s.id === id)
export const personById = (id) => PEOPLE.find((p) => p.id === id)

// The employee shown first in Employee view; left with pending items so the demo shows pinned updates.
export const DEMO_EMPLOYEE_ID = EMPLOYEES[0].id

const DAY = 24 * 60 * 60 * 1000

// Deterministic 0–1 value from a string, so seeded data is the same on every reset.
function hash(str) {
  let h = 2166136261
  for (const c of str) {
    h ^= c.charCodeAt(0)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

export function buildSeedData(now = Date.now()) {
  const [denverMgr, boulderMgr, , springsMgr] = MANAGERS

  const announcements = [
    {
      id: 'a1',
      title: 'Updated wet-floor safety procedure',
      message:
        'With winter weather arriving, slip-and-fall risk at entrances goes up. Effective immediately:\n\n' +
        '• Place wet-floor signs at every entrance whenever snow or rain is in the forecast.\n' +
        '• Check and mop entry mats at least once every hour.\n' +
        '• Report any spill or injury to your shift lead right away, even if no one was hurt.\n\n' +
        'Thank you for keeping customers and each other safe.',
      authorId: null,
      target: 'all',
      important: true,
      createdAt: now - 6 * DAY,
      ackRate: 0.86,
    },
    {
      id: 'a2',
      title: 'Thanksgiving & Black Friday hours',
      message:
        'Holiday schedule for all stores:\n\n' +
        '• Wed, Nov 25: normal hours (9am–9pm)\n' +
        '• Thu, Nov 26 (Thanksgiving): CLOSED\n' +
        '• Fri, Nov 27 (Black Friday): 6am–11pm\n' +
        '• Sat, Nov 28: 8am–10pm\n\n' +
        'Updated shift schedules will be posted in the break room by Nov 10. Time-off requests for Black Friday weekend must go to your manager by Nov 8.',
      authorId: null,
      target: 'all',
      important: true,
      createdAt: now - 3 * DAY,
      ackRate: 0.58,
    },
    {
      id: 'a3',
      title: 'New return policy starts Nov 15',
      message:
        'Starting Nov 15, our return window changes:\n\n' +
        '• Standard returns: 45 days with receipt (up from 30).\n' +
        '• Holiday purchases (Nov 15 – Dec 24): returnable through Jan 31.\n' +
        '• No receipt: store credit only, valid ID required.\n' +
        '• Opened electronics: 15 days, 10% restocking fee.\n\n' +
        'Updated signs will arrive at each store by Nov 13. Please review the policy so you can answer customer questions.',
      authorId: null,
      target: 'all',
      important: true,
      createdAt: now - 1 * DAY,
      ackRate: 0.31,
    },
    {
      id: 'a4',
      title: 'Loading dock door under repair',
      message:
        'The rear loading dock door is being repaired Monday through Wednesday. Use the side stockroom entrance for all deliveries and trash runs. Do not try to open the dock door manually.',
      authorId: boulderMgr.id,
      target: 'boulder',
      important: true,
      createdAt: now - 2 * DAY,
      ackRate: 0.72,
    },
    {
      id: 'a5',
      title: 'Break room fridge clean-out this Friday',
      message:
        'Friendly reminder: the break room fridge gets cleaned out Friday at 6pm. Anything left inside will be tossed, so please label your food or take it home.',
      authorId: denverMgr.id,
      target: 'denver',
      important: false,
      createdAt: now - 4 * DAY,
    },
    {
      id: 'a6',
      title: 'Great job on the fall sale weekend!',
      message:
        'We beat our sales goal by 12% last weekend. Thank you all for the hard work. Coffee and donuts are on me Saturday morning.',
      authorId: springsMgr.id,
      target: 'springs',
      important: false,
      createdAt: now - 5 * DAY,
    },
  ]

  // acks: { [announcementId]: { [employeeId]: timestamp } }
  const acks = {}
  for (const a of announcements) {
    if (!a.important) continue
    acks[a.id] = {}
    const audience = EMPLOYEES.filter((e) => a.target === 'all' || e.storeId === a.target)
    for (const e of audience) {
      const isDemo = e.id === DEMO_EMPLOYEE_ID
      // The demo employee has acknowledged only the oldest update.
      if (isDemo ? a.id === 'a1' : hash(a.id + e.id) < a.ackRate) {
        const elapsed = now - a.createdAt
        acks[a.id][e.id] = a.createdAt + Math.floor(hash(e.id + a.id) * elapsed)
      }
    }
    delete a.ackRate
  }

  return { announcements, acks }
}

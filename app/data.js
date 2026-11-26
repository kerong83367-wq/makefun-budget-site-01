// HomeLedger seed data: one fictional household, the Alvarez family, and three
// months of their money. Nothing here is fetched from anywhere; it is the
// starting point the site loads the first time it opens, and every number on
// screen afterwards comes from the household's own edits, kept in localStorage.

export const HOUSEHOLD = {
  name: 'The Alvarez household',
  members: 'Maya & Daniel, plus Sofia (9) and Leo (6)',
  currency: 'USD',
};

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#2e6f4e' },
  { id: 'groceries', label: 'Groceries', color: '#d9a441' },
  { id: 'dining', label: 'Dining out', color: '#c65d3b' },
  { id: 'transport', label: 'Transport', color: '#4a7fa5' },
  { id: 'utilities', label: 'Utilities', color: '#7a6aa8' },
  { id: 'childcare', label: 'Childcare', color: '#4fa08a' },
  { id: 'entertainment', label: 'Entertainment', color: '#b85c8a' },
  { id: 'health', label: 'Health', color: '#5a9e6f' },
  { id: 'shopping', label: 'Shopping', color: '#8a7a5c' },
  { id: 'other', label: 'Other', color: '#9aa0a6' },
];

// Monthly spending limits, per category. November is the month the site opens on.
export const BUDGETS = {
  '2026-09': { housing: 1850, groceries: 600, dining: 260, transport: 280, utilities: 350, childcare: 840, entertainment: 120, health: 220, shopping: 240, other: 100 },
  '2026-10': { housing: 1850, groceries: 620, dining: 300, transport: 260, utilities: 320, childcare: 840, entertainment: 150, health: 150, shopping: 420, other: 100 },
  '2026-11': { housing: 1850, groceries: 620, dining: 280, transport: 260, utilities: 330, childcare: 840, entertainment: 120, health: 150, shopping: 300, other: 100 },
};

export const SEED_TRANSACTIONS = [
  // ---- September 2026 ----
  { id: 's01', date: '2026-09-01', kind: 'income', category: null, note: "Maya's salary", amount: 4100 },
  { id: 's02', date: '2026-09-01', kind: 'expense', category: 'housing', note: 'Rent', amount: 1850 },
  { id: 's03', date: '2026-09-01', kind: 'expense', category: 'childcare', note: 'After-school program', amount: 420 },
  { id: 's04', date: '2026-09-02', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 128.6 },
  { id: 's05', date: '2026-09-05', kind: 'expense', category: 'transport', note: 'Gas — Fill-up', amount: 54.2 },
  { id: 's06', date: '2026-09-06', kind: 'expense', category: 'dining', note: 'Saturday brunch', amount: 46.8 },
  { id: 's07', date: '2026-09-08', kind: 'expense', category: 'utilities', note: 'Electric bill', amount: 118.9 },
  { id: 's08', date: '2026-09-09', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 96.4 },
  { id: 's09', date: '2026-09-11', kind: 'expense', category: 'health', note: 'Pharmacy — Leo inhaler refill', amount: 32.5 },
  { id: 's10', date: '2026-09-13', kind: 'expense', category: 'shopping', note: 'School shoes for Sofia', amount: 64.99 },
  { id: 's11', date: '2026-09-15', kind: 'income', category: null, note: "Daniel's salary", amount: 2750 },
  { id: 's12', date: '2026-09-15', kind: 'expense', category: 'childcare', note: 'After-school program', amount: 420 },
  { id: 's13', date: '2026-09-16', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 141.2 },
  { id: 's14', date: '2026-09-18', kind: 'expense', category: 'transport', note: 'Gas — Fill-up', amount: 49.75 },
  { id: 's15', date: '2026-09-19', kind: 'expense', category: 'entertainment', note: 'Movie night — two tickets', amount: 31 },
  { id: 's16', date: '2026-09-20', kind: 'expense', category: 'utilities', note: 'Internet', amount: 65 },
  { id: 's17', date: '2026-09-21', kind: 'expense', category: 'dining', note: 'Pizza Friday', amount: 58.4 },
  { id: 's18', date: '2026-09-23', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 104.55 },
  { id: 's19', date: '2026-09-24', kind: 'expense', category: 'health', note: 'Dentist check-up — Sofia', amount: 75 },
  { id: 's20', date: '2026-09-25', kind: 'expense', category: 'transport', note: 'Car wash + oil top-up', amount: 42 },
  { id: 's21', date: '2026-09-26', kind: 'expense', category: 'shopping', note: 'Winter jackets — kids', amount: 122.5 },
  { id: 's22', date: '2026-09-27', kind: 'expense', category: 'dining', note: 'Takeout Thai', amount: 44.2 },
  { id: 's23', date: '2026-09-28', kind: 'expense', category: 'utilities', note: 'Water bill', amount: 52.3 },
  { id: 's24', date: '2026-09-29', kind: 'expense', category: 'other', note: 'Birthday gift — Grandma', amount: 38 },
  { id: 's25', date: '2026-09-30', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 100.35 },
  { id: 's26', date: '2026-09-30', kind: 'expense', category: 'transport', note: 'Bus passes — October', amount: 96 },
  // ---- October 2026 ----
  { id: 'o01', date: '2026-10-01', kind: 'income', category: null, note: "Maya's salary", amount: 4100 },
  { id: 'o02', date: '2026-10-01', kind: 'expense', category: 'housing', note: 'Rent', amount: 1850 },
  { id: 'o03', date: '2026-10-01', kind: 'expense', category: 'childcare', note: 'After-school program', amount: 420 },
  { id: 'o04', date: '2026-10-03', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 134.9 },
  { id: 'o05', date: '2026-10-04', kind: 'expense', category: 'shopping', note: 'Halloween costumes', amount: 86.4 },
  { id: 'o06', date: '2026-10-06', kind: 'expense', category: 'transport', note: 'Gas — Fill-up', amount: 51.6 },
  { id: 'o07', date: '2026-10-07', kind: 'expense', category: 'utilities', note: 'Electric bill', amount: 109.7 },
  { id: 'o08', date: '2026-10-10', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 118.25 },
  { id: 'o09', date: '2026-10-11', kind: 'expense', category: 'dining', note: 'Anniversary dinner', amount: 92.5 },
  { id: 'o10', date: '2026-10-13', kind: 'expense', category: 'entertainment', note: 'Streaming — annual plan', amount: 119.99 },
  { id: 'o11', date: '2026-10-15', kind: 'income', category: null, note: "Daniel's salary", amount: 2750 },
  { id: 'o12', date: '2026-10-15', kind: 'expense', category: 'childcare', note: 'After-school program', amount: 420 },
  { id: 'o13', date: '2026-10-17', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 142.8 },
  { id: 'o14', date: '2026-10-18', kind: 'expense', category: 'health', note: 'Flu shots — family', amount: 60 },
  { id: 'o15', date: '2026-10-19', kind: 'expense', category: 'transport', note: 'Gas — Fill-up', amount: 47.9 },
  { id: 'o16', date: '2026-10-21', kind: 'expense', category: 'dining', note: 'Pizza Friday', amount: 54.6 },
  { id: 'o17', date: '2026-10-22', kind: 'expense', category: 'shopping', note: 'New tires — rear pair', amount: 289 },
  { id: 'o18', date: '2026-10-24', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 122.4 },
  { id: 'o19', date: '2026-10-25', kind: 'expense', category: 'utilities', note: 'Internet', amount: 65 },
  { id: 'o20', date: '2026-10-26', kind: 'expense', category: 'dining', note: 'Takeout Thai', amount: 47.3 },
  { id: 'o21', date: '2026-10-27', kind: 'expense', category: 'health', note: 'Pharmacy — vitamins', amount: 36.2 },
  { id: 'o22', date: '2026-10-28', kind: 'expense', category: 'transport', note: 'Bus passes — November', amount: 96 },
  { id: 'o23', date: '2026-10-29', kind: 'expense', category: 'utilities', note: 'Water bill', amount: 49.8 },
  { id: 'o24', date: '2026-10-30', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 85.75 },
  { id: 'o25', date: '2026-10-31', kind: 'expense', category: 'other', note: 'Pumpkin patch entry', amount: 42 },
  { id: 'o26', date: '2026-10-31', kind: 'expense', category: 'dining', note: 'Halloween pizza', amount: 61.4 },
  // ---- November 2026 ----
  { id: 'n01', date: '2026-11-01', kind: 'income', category: null, note: "Maya's salary", amount: 4100 },
  { id: 'n02', date: '2026-11-01', kind: 'expense', category: 'housing', note: 'Rent', amount: 1850 },
  { id: 'n03', date: '2026-11-01', kind: 'expense', category: 'childcare', note: 'After-school program', amount: 420 },
  { id: 'n04', date: '2026-11-01', kind: 'expense', category: 'transport', note: 'Bus passes — November', amount: 96 },
  { id: 'n05', date: '2026-11-02', kind: 'expense', category: 'transport', note: 'Gas — Fill-up', amount: 52.3 },
  { id: 'n06', date: '2026-11-03', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 132.4 },
  { id: 'n07', date: '2026-11-04', kind: 'expense', category: 'health', note: 'Pharmacy — Leo inhaler refill', amount: 28.6 },
  { id: 'n08', date: '2026-11-05', kind: 'expense', category: 'dining', note: 'Taco truck lunch', amount: 42.5 },
  { id: 'n09', date: '2026-11-06', kind: 'expense', category: 'utilities', note: 'Electric bill', amount: 112.4 },
  { id: 'n10', date: '2026-11-07', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 86.15 },
  { id: 'n11', date: '2026-11-07', kind: 'expense', category: 'entertainment', note: 'Movie night — two tickets', amount: 34 },
  { id: 'n12', date: '2026-11-08', kind: 'expense', category: 'utilities', note: 'Internet', amount: 65 },
  { id: 'n13', date: '2026-11-09', kind: 'expense', category: 'dining', note: 'Pasta night out', amount: 68 },
  { id: 'n14', date: '2026-11-11', kind: 'expense', category: 'shopping', note: "Kids' shoes — Sofia & Leo", amount: 89.99 },
  { id: 'n15', date: '2026-11-12', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 154.8 },
  { id: 'n16', date: '2026-11-12', kind: 'expense', category: 'utilities', note: 'Water bill', amount: 48.2 },
  { id: 'n17', date: '2026-11-13', kind: 'expense', category: 'other', note: 'Birthday gift — Grandma', amount: 45 },
  { id: 'n18', date: '2026-11-14', kind: 'expense', category: 'entertainment', note: 'Streaming — monthly', amount: 15.99 },
  { id: 'n19', date: '2026-11-15', kind: 'income', category: null, note: "Daniel's salary", amount: 2750 },
  { id: 'n20', date: '2026-11-15', kind: 'expense', category: 'childcare', note: 'After-school program', amount: 420 },
  { id: 'n21', date: '2026-11-15', kind: 'expense', category: 'dining', note: 'Coffee & bagels', amount: 24.75 },
  { id: 'n22', date: '2026-11-16', kind: 'expense', category: 'transport', note: 'Gas — Fill-up', amount: 48.75 },
  { id: 'n23', date: '2026-11-17', kind: 'expense', category: 'health', note: 'Dentist copay — Daniel', amount: 75 },
  { id: 'n24', date: '2026-11-18', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 97.3 },
  { id: 'n25', date: '2026-11-19', kind: 'expense', category: 'transport', note: 'Parking — downtown', amount: 18 },
  { id: 'n26', date: '2026-11-20', kind: 'expense', category: 'utilities', note: 'Phone — family plan', amount: 84 },
  { id: 'n27', date: '2026-11-21', kind: 'expense', category: 'dining', note: 'Family pizza night', amount: 83.2 },
  { id: 'n28', date: '2026-11-22', kind: 'expense', category: 'entertainment', note: 'Bookshop — Sofia', amount: 27.5 },
  { id: 'n29', date: '2026-11-23', kind: 'expense', category: 'shopping', note: 'Winter coats — kids', amount: 164 },
  { id: 'n30', date: '2026-11-24', kind: 'expense', category: 'groceries', note: 'Green Market weekly shop', amount: 118.55 },
  { id: 'n31', date: '2026-11-25', kind: 'expense', category: 'transport', note: 'Car insurance — monthly', amount: 132 },
  { id: 'n32', date: '2026-11-26', kind: 'expense', category: 'dining', note: 'Thanksgiving takeout', amount: 52 },
];

export const SEED_GOALS = [
  { id: 'g1', name: 'Emergency fund', target: 10000, saved: 6400, note: 'Six months of essentials, one deposit at a time.' },
  { id: 'g2', name: 'Summer road trip', target: 2500, saved: 1150, note: 'Two weeks down the coast, campsites booked by May.' },
  { id: 'g3', name: 'New car down payment', target: 8000, saved: 2300, note: 'The old hatchback has 148,000 miles on it.' },
];

// One short, practical tip per month, shown on the dashboard.
export const TIPS = {
  '2026-09': 'A budget that only counts the big bills misses the money. The $30 trips — coffee, snacks, the school bake sale — are where most months leak.',
  '2026-10': 'Pay yourself first: move money to savings on payday, not at the end of the month. What is left in checking is what you actually have to spend.',
  '2026-11': 'Groceries are the easiest budget to bend without feeling it. Shop with a list, eat before you go, and the same cart costs 10–15% less.',
};

export const MONTHS = ['2026-09', '2026-10', '2026-11'];
export const DEFAULT_MONTH = '2026-11';

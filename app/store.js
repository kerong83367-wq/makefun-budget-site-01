// HomeLedger state: everything the household edits lives here, in memory and in
// localStorage. The seed data in data.js is only the first load; after that the
// household's own numbers are the truth, and they never leave this browser.

import { BUDGETS, DEFAULT_MONTH, MONTHS, SEED_GOALS, SEED_TRANSACTIONS } from './data.js';

const STORAGE_KEY = 'homeledger-v1';

function freshState() {
  const budgets = {};
  for (const month of MONTHS) budgets[month] = { ...BUDGETS[month] };
  return {
    month: DEFAULT_MONTH,
    transactions: SEED_TRANSACTIONS.map((t) => ({ ...t })),
    budgets,
    goals: SEED_GOALS.map((g) => ({ ...g })),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.transactions) || !parsed.budgets) return freshState();
    return parsed;
  } catch {
    return freshState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // A full or blocked store should never break the page; the in-memory
    // state keeps working for this visit.
  }
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return freshState();
}

export function monthOf(date) {
  return date.slice(0, 7);
}

export function monthTransactions(state, month) {
  return state.transactions
    .filter((t) => monthOf(t.date) === month)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function monthTotals(state, month) {
  let income = 0;
  let spent = 0;
  for (const t of state.transactions) {
    if (monthOf(t.date) !== month) continue;
    if (t.kind === 'income') income += t.amount;
    else spent += t.amount;
  }
  return { income: round2(income), spent: round2(spent), left: round2(income - spent) };
}

export function categorySpend(state, month) {
  const spend = {};
  for (const t of state.transactions) {
    if (t.kind !== 'expense' || monthOf(t.date) !== month) continue;
    spend[t.category] = round2((spend[t.category] ?? 0) + t.amount);
  }
  return spend;
}

export function budgetStatus(state, month) {
  const limits = state.budgets[month] ?? {};
  const spend = categorySpend(state, month);
  return Object.keys(limits).map((category) => {
    const limit = limits[category];
    const used = spend[category] ?? 0;
    return { category, limit, used, left: round2(limit - used), pct: limit > 0 ? used / limit : 0 };
  });
}

export function addTransaction(state, txn) {
  const id = `u${Date.now().toString(36)}${Math.floor(Math.random() * 1e6).toString(36)}`;
  state.transactions.push({ id, ...txn });
  saveState(state);
  return id;
}

export function removeTransaction(state, id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  saveState(state);
}

export function setBudgetLimit(state, month, category, limit) {
  if (!state.budgets[month]) state.budgets[month] = {};
  state.budgets[month][category] = Math.max(0, Math.round(limit));
  saveState(state);
}

export function addToGoal(state, goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;
  goal.saved = round2(Math.max(0, goal.saved + amount));
  saveState(state);
}

export function addGoal(state, goal) {
  const id = `g${Date.now().toString(36)}`;
  state.goals.push({ id, ...goal });
  saveState(state);
  return id;
}

export function money(n) {
  return `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function monthName(month) {
  const [year, m] = month.split('-').map(Number);
  return new Date(Date.UTC(year, m - 1, 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function shortDate(date) {
  const [year, m, d] = date.split('-').map(Number);
  return new Date(Date.UTC(year, m - 1, d)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

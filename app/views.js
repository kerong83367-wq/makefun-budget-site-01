// HomeLedger views: every page of the site as a function of the state. Each
// view returns plain HTML; main.js puts it on screen and wires the buttons.
// Nothing here fetches anything — the numbers come from store.js.

import { CATEGORIES, HOUSEHOLD, TIPS } from './data.js';
import { budgetStatus, categorySpend, money, monthName, monthOf, monthTotals, monthTransactions, shortDate } from './store.js';
import { donutChart, meterBar } from './charts.js';

export function esc(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function categoryOf(id) {
  return CATEGORIES.find((c) => c.id === id) ?? { id, label: 'Other', color: '#9aa0a6' };
}

function monthNav(state) {
  const months = ['2026-09', '2026-10', '2026-11'];
  const i = months.indexOf(state.month);
  const prev = i > 0 ? months[i - 1] : null;
  const next = i < months.length - 1 ? months[i + 1] : null;
  return `<div class="month-nav">
    <button type="button" data-action="set-month" data-month="${prev ?? ''}" ${prev ? '' : 'disabled'} aria-label="Previous month">‹</button>
    <h2>${monthName(state.month)}</h2>
    <button type="button" data-action="set-month" data-month="${next ?? ''}" ${next ? '' : 'disabled'} aria-label="Next month">›</button>
  </div>`;
}

function statCard(label, value, sub, tone) {
  return `<section class="stat ${tone}"><p class="stat-label">${label}</p><p class="stat-value">${value}</p><p class="stat-sub">${sub}</p></section>`;
}

export function dashboard(state) {
  const totals = monthTotals(state, state.month);
  const spend = categorySpend(state, state.month);
  const segments = CATEGORIES.map((c) => ({ label: c.label, value: spend[c.id] ?? 0, color: c.color })).filter((s) => s.value > 0);
  const budgets = budgetStatus(state, state.month).sort((a, b) => b.pct - a.pct);
  const recent = monthTransactions(state, state.month).slice(0, 6);
  const over = budgets.filter((b) => b.pct > 1);
  const spentPct = totals.income > 0 ? Math.round((totals.spent / totals.income) * 100) : 0;

  const legend = segments
    .sort((a, b) => b.value - a.value)
    .map((s) => `<li><span class="dot" style="background:${s.color}"></span>${esc(s.label)}<span class="legend-amount">${money(s.value)}</span></li>`)
    .join('');

  const budgetRows = budgets
    .slice(0, 3)
    .map((b) => {
      const c = categoryOf(b.category);
      const tone = b.pct > 1 ? 'over' : b.pct > 0.85 ? 'warn' : 'ok';
      return `<li><span class="dot" style="background:${c.color}"></span>${esc(c.label)}
        <span class="legend-amount">${money(b.used)} of ${money(b.limit)}</span>${meterBar(b.pct, tone)}</li>`;
    })
    .join('');

  const recentRows = recent
    .map((t) => {
      const c = t.category ? categoryOf(t.category) : null;
      return `<li class="txn-row"><span class="txn-date">${shortDate(t.date)}</span>
        <span class="txn-note">${esc(t.note)}</span>
        <span class="txn-cat">${c ? esc(c.label) : 'Income'}</span>
        <span class="txn-amount ${t.kind}">${t.kind === 'income' ? '+' : '−'}${money(t.amount)}</span></li>`;
    })
    .join('');

  const goalRows = state.goals
    .map((g) => {
      const pct = g.target > 0 ? g.saved / g.target : 0;
      return `<li><strong>${esc(g.name)}</strong><span class="legend-amount">${money(g.saved)} of ${money(g.target)}</span>${meterBar(pct, 'ok')}</li>`;
    })
    .join('');

  return `
  <p class="page-intro">${esc(HOUSEHOLD.name)} — ${esc(HOUSEHOLD.members)}. Everything below is this month's real money.</p>
  ${monthNav(state)}
  <div class="stats">
    ${statCard('Income', money(totals.income), 'two paydays', 'in')}
    ${statCard('Spent', money(totals.spent), `${spentPct}% of income`, 'out')}
    ${statCard('Left to spend', money(totals.left), totals.left >= 0 ? 'on track for the month' : 'over income — see budgets', totals.left >= 0 ? 'left' : 'over')}
  </div>
  <div class="grid-two">
    <section class="card">
      <h3>Where ${monthName(state.month).split(' ')[0]}'s money went</h3>
      <div class="donut-wrap">${donutChart(segments)}<ul class="legend">${legend}</ul></div>
    </section>
    <section class="card">
      <h3>Budgets closest to the edge</h3>
      <ul class="tight-list">${budgetRows}</ul>
      ${over.length ? `<p class="alert">${esc(over.map((b) => categoryOf(b.category).label).join(', '))} ${over.length === 1 ? 'is' : 'are'} over budget this month.</p>` : '<p class="fine">Every category is inside its limit so far.</p>'}
      <p><a class="button" href="#/budgets">See all budgets</a></p>
    </section>
  </div>
  <div class="grid-two">
    <section class="card">
      <h3>Recent transactions</h3>
      <ul class="tight-list">${recentRows}</ul>
      <p><a class="button" href="#/transactions">All transactions</a></p>
    </section>
    <section class="card">
      <h3>Savings goals</h3>
      <ul class="tight-list">${goalRows}</ul>
      <p><a class="button" href="#/goals">Open goals</a></p>
      <aside class="tip"><strong>Tip for this month:</strong> ${esc(TIPS[state.month] ?? '')}</aside>
    </section>
  </div>`;
}

export function transactions(state, filter) {
  const all = monthTransactions(state, state.month);
  const shown = all.filter((t) => {
    if (filter.kind !== 'all' && t.kind !== filter.kind) return false;
    if (filter.category !== 'all' && t.category !== filter.category) return false;
    if (filter.q && !t.note.toLowerCase().includes(filter.q.toLowerCase())) return false;
    return true;
  });
  const shownSpent = shown.filter((t) => t.kind === 'expense').reduce((s, t) => s + t.amount, 0);
  const shownIncome = shown.filter((t) => t.kind === 'income').reduce((s, t) => s + t.amount, 0);

  const categoryOptions = ['<option value="all">All categories</option>']
    .concat(CATEGORIES.map((c) => `<option value="${c.id}" ${filter.category === c.id ? 'selected' : ''}>${esc(c.label)}</option>`))
    .join('');
  const formCategories = CATEGORIES.map((c) => `<option value="${c.id}">${esc(c.label)}</option>`).join('');

  const rows = shown
    .map((t) => {
      const c = t.category ? categoryOf(t.category) : null;
      return `<li class="txn-row">
        <span class="txn-date">${shortDate(t.date)}</span>
        <span class="txn-note">${esc(t.note)}</span>
        <span class="txn-cat">${c ? esc(c.label) : 'Income'}</span>
        <span class="txn-amount ${t.kind}">${t.kind === 'income' ? '+' : '−'}${money(t.amount)}</span>
        <button type="button" class="link-button danger" data-action="delete-txn" data-id="${t.id}">Delete</button>
      </li>`;
    })
    .join('');

  return `
  <p class="page-intro">Every dollar in and out for ${monthName(state.month)}. Add one below, or delete a row that should not be there.</p>
  ${monthNav(state)}
  <section class="card">
    <h3>Add a transaction</h3>
    <form id="add-txn" class="form-grid">
      <label>Date <input type="date" name="date" value="${state.month}-26" required></label>
      <label>What was it? <input type="text" name="note" placeholder="e.g. Weekly shop" maxlength="80" required></label>
      <label>Type <select name="kind"><option value="expense">Spending</option><option value="income">Income</option></select></label>
      <label>Category <select name="category">${formCategories}</select></label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <button type="submit" class="button primary">Add transaction</button>
    </form>
  </section>
  <section class="card">
    <h3>Filter</h3>
    <div class="filters">
      <div class="seg" role="group" aria-label="Type">
        <button type="button" data-action="filter-kind" data-kind="all" class="${filter.kind === 'all' ? 'active' : ''}">All</button>
        <button type="button" data-action="filter-kind" data-kind="expense" class="${filter.kind === 'expense' ? 'active' : ''}">Spending</button>
        <button type="button" data-action="filter-kind" data-kind="income" class="${filter.kind === 'income' ? 'active' : ''}">Income</button>
      </div>
      <select id="filter-category" aria-label="Category">${categoryOptions}</select>
      <input id="filter-q" type="search" placeholder="Search notes…" value="${esc(filter.q)}" aria-label="Search notes">
    </div>
    <p class="filter-summary">${shown.length} of ${all.length} transactions · spent ${money(shownSpent)} · income ${money(shownIncome)}</p>
    <ul class="tight-list">${rows || '<li class="empty">Nothing matches these filters.</li>'}</ul>
  </section>`;
}

export function budgets(state) {
  const rows = budgetStatus(state, state.month).map((b) => {
    const c = categoryOf(b.category);
    const tone = b.pct > 1 ? 'over' : b.pct > 0.85 ? 'warn' : 'ok';
    const note = b.pct > 1 ? `${money(Math.abs(b.left))} over` : `${money(b.left)} left`;
    return `<li class="budget-row">
      <div class="budget-head"><span class="dot" style="background:${c.color}"></span><strong>${esc(c.label)}</strong>
      <span class="legend-amount">${money(b.used)} of ${money(b.limit)}</span></div>
      ${meterBar(b.pct, tone)}
      <div class="budget-foot"><span class="${tone === 'over' ? 'over-text' : ''}">${note} · ${Math.round(b.pct * 100)}% used</span>
      <form class="limit-form" data-category="${b.category}">
        <label>Monthly limit $ <input type="number" name="limit" min="0" step="1" value="${b.limit}" required></label>
        <button type="submit" class="button small">Save limit</button>
      </form></div>
    </li>`;
  });
  const totals = monthTotals(state, state.month);
  const totalLimit = Object.values(state.budgets[state.month] ?? {}).reduce((s, v) => s + v, 0);

  return `
  <p class="page-intro">Set a limit for each category, then watch the bars. A limit you change applies to ${monthName(state.month)} only — other months keep theirs.</p>
  ${monthNav(state)}
  <section class="card">
    <h3>${monthName(state.month)} limits</h3>
    <p class="filter-summary">Total limits ${money(totalLimit)} · spent ${money(totals.spent)} · ${money(Math.max(totalLimit - totals.spent, 0))} of budget unspent</p>
    <ul class="budget-list">${rows.join('')}</ul>
  </section>`;
}

export function goals(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  const cards = state.goals
    .map((g) => {
      const pct = g.target > 0 ? g.saved / g.target : 0;
      return `<li class="goal-card">
      <h4>${esc(g.name)}</h4>
      <p class="goal-note">${esc(g.note)}</p>
      <p class="goal-numbers"><strong>${money(g.saved)}</strong> of ${money(g.target)} · ${Math.round(pct * 100)}%</p>
      ${meterBar(pct, 'ok')}
      <div class="goal-actions">
        <button type="button" class="button small" data-action="add-goal" data-id="${g.id}" data-amount="25">+$25</button>
        <button type="button" class="button small" data-action="add-goal" data-id="${g.id}" data-amount="50">+$50</button>
        <button type="button" class="button small" data-action="add-goal" data-id="${g.id}" data-amount="100">+$100</button>
        <form class="goal-form" data-id="${g.id}">
          <label>$ <input type="number" name="amount" min="1" step="1" placeholder="Amount" required></label>
          <button type="submit" class="button small">Add</button>
        </form>
      </div>
    </li>`;
    })
    .join('');

  return `
  <p class="page-intro">Money with a job. ${money(totalSaved)} saved toward ${money(totalTarget)} of goals — add a little whenever payday lands.</p>
  <section class="card">
    <h3>Your goals</h3>
    <ul class="goal-list">${cards}</ul>
  </section>
  <section class="card">
    <h3>Start a new goal</h3>
    <form id="add-goal" class="form-grid">
      <label>Goal name <input type="text" name="name" placeholder="e.g. Christmas fund" maxlength="60" required></label>
      <label>Target ($) <input type="number" name="target" min="1" step="1" placeholder="1000" required></label>
      <label>Already saved ($) <input type="number" name="saved" min="0" step="1" value="0"></label>
      <button type="submit" class="button primary">Add goal</button>
    </form>
  </section>`;
}

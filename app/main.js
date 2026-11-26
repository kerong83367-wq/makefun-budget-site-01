// HomeLedger router and wiring: four hash routes, one page shell, and every
// button and form on the site handled here by delegation. The page re-renders
// from state after each change, so what you see is always what is stored.
//
//   #/                Dashboard
//   #/transactions    Transactions
//   #/budgets         Budgets
//   #/goals           Savings goals
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { loadState, resetState, saveState, addTransaction, removeTransaction, setBudgetLimit, addToGoal, addGoal } from './store.js';
import { dashboard, transactions, budgets, goals } from './views.js';

const app = document.getElementById('app');
const state = loadState();

// Filter state for the transactions page; it is a view choice, not data, so
// it lives in memory and resets when the page is left.
const filter = { kind: 'all', category: 'all', q: '' };

function currentRoute() {
  const hash = location.hash || '#/';
  if (hash.startsWith('#/transactions')) return 'transactions';
  if (hash.startsWith('#/budgets')) return 'budgets';
  if (hash.startsWith('#/goals')) return 'goals';
  return 'dashboard';
}

function render() {
  window.__shotReady = false;
  const route = currentRoute();
  if (route === 'transactions') app.innerHTML = transactions(state, filter);
  else if (route === 'budgets') app.innerHTML = budgets(state);
  else if (route === 'goals') app.innerHTML = goals(state);
  else app.innerHTML = dashboard(state);
  document.querySelectorAll('nav a').forEach((a) => {
    const href = a.getAttribute('href') ?? '';
    const isCurrent = (route === 'dashboard' && href === '#/') || href === `#/${route}`;
    a.classList.toggle('current', isCurrent);
    if (isCurrent) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.title = `HomeLedger — ${route === 'dashboard' ? 'Dashboard' : route[0].toUpperCase() + route.slice(1)}`;
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function rerender() {
  saveState(state);
  render();
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'set-month') {
    if (button.dataset.month) {
      state.month = button.dataset.month;
      rerender();
    }
  } else if (action === 'filter-kind') {
    filter.kind = button.dataset.kind;
    render();
  } else if (action === 'delete-txn') {
    removeTransaction(state, button.dataset.id);
    render();
  } else if (action === 'add-goal') {
    addToGoal(state, button.dataset.id, Number(button.dataset.amount));
    render();
  } else if (action === 'reset-demo') {
    if (window.confirm('Reset HomeLedger to the Alvarez family sample data? Your edits will be lost.')) {
      const fresh = resetState();
      Object.assign(state, fresh);
      rerender();
    }
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target;
  event.preventDefault();
  const data = new FormData(form);
  if (form.id === 'add-txn') {
    const amount = Number(data.get('amount'));
    const kind = data.get('kind');
    const category = kind === 'income' ? null : data.get('category');
    if (!Number.isFinite(amount) || amount <= 0) return;
    addTransaction(state, {
      date: data.get('date') || `${state.month}-01`,
      kind,
      category,
      note: String(data.get('note') ?? '').trim() || 'Untitled',
      amount: Math.round(amount * 100) / 100,
    });
    rerender();
  } else if (form.classList.contains('limit-form')) {
    const limit = Number(data.get('limit'));
    if (Number.isFinite(limit) && limit >= 0) {
      setBudgetLimit(state, state.month, form.dataset.category, limit);
      rerender();
    }
  } else if (form.classList.contains('goal-form')) {
    const amount = Number(data.get('amount'));
    if (Number.isFinite(amount) && amount > 0) {
      addToGoal(state, form.dataset.id, amount);
      rerender();
    }
  } else if (form.id === 'add-goal') {
    const target = Number(data.get('target'));
    const saved = Number(data.get('saved')) || 0;
    if (!Number.isFinite(target) || target <= 0) return;
    addGoal(state, {
      name: String(data.get('name') ?? '').trim() || 'New goal',
      target: Math.round(target),
      saved: Math.max(0, Math.round(saved)),
      note: 'Added by the household.',
    });
    rerender();
  }
});

document.addEventListener('change', (event) => {
  const el = event.target;
  if (el.id === 'filter-category') {
    filter.category = el.value;
    render();
  }
});

document.addEventListener('input', (event) => {
  const el = event.target;
  if (el.id === 'filter-q') {
    filter.q = el.value;
    // Re-render, but keep the caret where the typist left it.
    const caret = el.selectionStart;
    render();
    const again = document.getElementById('filter-q');
    if (again) {
      again.focus();
      again.setSelectionRange(caret, caret);
    }
  }
});

window.addEventListener('hashchange', render);
render();

// HomeLedger charts: small, dependency-free SVG pictures drawn from the
// household's own numbers. No library, no canvas, no network — just circles
// and bars the browser already knows how to draw.

import { money } from './store.js';

// A donut of spending by category. Each slice is a circle segment drawn with
// stroke-dasharray on a ring, so the chart stays crisp at any size.
export function donutChart(segments, size = 220) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  if (total <= 0) {
    return `<svg class="donut" viewBox="0 0 ${size} ${size}" role="img" aria-label="No spending yet this month">
      <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#e7e2d4" stroke-width="26"></circle>
      <text x="${center}" y="${center}" text-anchor="middle" class="donut-center">No spending yet</text>
    </svg>`;
  }
  let offset = 0.25; // start at the top, like a clock
  const rings = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const frac = s.value / total;
      const dash = `${Math.max(frac * circumference - 2, 0.5)} ${circumference}`;
      const rotate = offset * 360;
      offset += frac;
      return `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="${s.color}" stroke-width="26" stroke-dasharray="${dash}" stroke-dashoffset="0" transform="rotate(${rotate} ${center} ${center})"><title>${s.label}: ${money(s.value)}</title></circle>`;
    })
    .join('');
  return `<svg class="donut" viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category, ${money(total)} in total">
    <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#efece2" stroke-width="26"></circle>
    ${rings}
    <text x="${center}" y="${center - 8}" text-anchor="middle" class="donut-total">${money(total)}</text>
    <text x="${center}" y="${center + 16}" text-anchor="middle" class="donut-label">spent</text>
  </svg>`;
}

// A thin horizontal bar: used for budget limits and savings goals.
export function meterBar(pct, tone) {
  const clamped = Math.max(0, Math.min(pct, 1));
  return `<div class="meter" role="img" aria-label="${Math.round(clamped * 100)} percent"><span class="meter-fill ${tone}" style="width:${(clamped * 100).toFixed(1)}%"></span></div>`;
}

// Date/time helper utilities shared across the app.

function pad(n) {
  return n.toString().padStart(2, '0');
}

export function fmtDate(d) {
  if (!d) return '—';
  const dt = d instanceof Date ? d : new Date(d);
  if (isNaN(dt)) return '—';
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${pad(dt.getDate())} ${months[dt.getMonth()]} ${dt.getFullYear()}`;
}

export function fmtTime(d) {
  const dt = d instanceof Date ? d : new Date(d);
  let h = dt.getHours();
  const m = dt.getMinutes();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${pad(h)}:${pad(m)} ${ampm}`;
}

export function isoDate(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return dt.toISOString().slice(0, 10);
}

export function addDays(date, days) {
  const dt = new Date(date);
  dt.setDate(dt.getDate() + days);
  return dt;
}

export function daysBetween(a, b) {
  const A = new Date(isoDate(a));
  const B = new Date(isoDate(b));
  return Math.round((B - A) / 86400000);
}

export function todayISO() {
  return isoDate(new Date());
}

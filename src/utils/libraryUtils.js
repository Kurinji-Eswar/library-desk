// General-purpose helpers used across the library application.

export const SCHEMA_VERSION = 1;

export const LS_KEYS = {
  books: 'library_books',
  members: 'library_members',
  loans: 'library_loans',
  reservations: 'library_reservations',
  categories: 'library_categories',
  settings: 'library_settings',
  version: 'library_schema_version',
};

export function uid(prefix) {
  return prefix + '-' + Math.random().toString(36).slice(2, 7).toUpperCase();
}

export function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Storage unavailable or quota exceeded — fail silently, app keeps working in-memory.
  }
}

export const CATEGORY_COLORS = {
  FICTION: '#0789B2',
  'NON-FICTION': '#D58B62',
  SCIENCE: '#A8D8D6',
  TECHNOLOGY: '#20201C',
  HISTORY: '#8E8B80',
  BIOGRAPHY: '#0789B2',
  'SELF HELP': '#D58B62',
  BUSINESS: '#8E8B80',
  PHILOSOPHY: '#A8D8D6',
  CHILDREN: '#D58B62',
  REFERENCE: '#20201C',
};

export function categoryColor(category) {
  return CATEGORY_COLORS[category] || '#8E8B80';
}

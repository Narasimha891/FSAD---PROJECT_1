/**
 * storageService.js
 * Thin wrapper around localStorage with JSON serialization.
 * When migrating to a real backend, replace these helpers with API calls
 * inside each domain service — no component changes required.
 */

export function get(key) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (err) {
    console.error('Storage write failed:', err)
  }
}

export function remove(key) {
  localStorage.removeItem(key)
}

import { useEffect, useState } from 'react'

// Reads a value from localStorage, falling back if it is missing or unreadable.
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    // Private browsing or corrupted data: use the fallback.
  }
  return typeof fallback === 'function' ? fallback() : fallback
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or blocked: the app still works for this visit.
  }
}

// useState that is saved to localStorage on every change.
export function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => load(key, fallback))
  useEffect(() => save(key, value), [key, value])
  return [value, setValue]
}

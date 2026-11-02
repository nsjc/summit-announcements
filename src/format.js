import { personById, storeById } from './data'

export function timeAgo(ts) {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return shortDate(ts)
}

export function shortDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function authorLabel(authorId) {
  const p = authorId && personById(authorId)
  return p ? `${p.name}, Store Manager` : 'Summit Retail HQ'
}

export function targetLabel(target) {
  return target === 'all' ? 'All stores' : storeById(target)?.name ?? 'Unknown store'
}

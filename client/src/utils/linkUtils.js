export const SHORTENER_BASE_URL = 'http://localhost:3001'

export function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 24)
}

export function buildShortCode(longUrl, customSlug) {
  const fallback = getHostname(longUrl)
  const slugCandidate = slugify(customSlug || fallback)

  if (slugCandidate) {
    return slugCandidate
  }

  return `go${Math.random().toString(36).slice(2, 8)}`
}

export function getHostname(value) {
  try {
    return new URL(value).hostname.replace(/^www\./, '')
  } catch {
    return 'invalid-url'
  }
}

/** Format ISO timestamp for HTML date input (calendar day, local) */
export function toDateInputValue(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Start of selected calendar day in local timezone → ISO */
export function dateInputToStartIso(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d, 0, 0, 0, 0).toISOString()
}

/** End of selected calendar day in local timezone → ISO */
export function dateInputToEndIso(dateStr) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d, 23, 59, 59, 999).toISOString()
}

export function formatDateOnlyDisplay(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function getLocalTimezoneLabel() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return 'your local timezone'
  }
}

export function parseTagsInput(input) {
  if (!input || typeof input !== 'string') return []
  return [...new Set(input.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean))].slice(0, 10)
}

export function formatTagsForInput(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return ''
  return tags.join(', ')
}

/** @deprecated use toDateInputValue for date-only fields */
export function toDatetimeLocalValue(value) {
  return toDateInputValue(value)
}

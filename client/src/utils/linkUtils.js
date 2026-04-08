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

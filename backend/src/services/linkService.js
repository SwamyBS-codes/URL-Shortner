import { BASE_URL } from '../config.js'
import { addLink, incrementClicks, checkCodeExists, queryLinkByCode, queryLinkByOriginalUrl, getDashboardStats, getRecentLinks, getAllLinksData } from '../data/linkStore.js'
import { getCachedOriginalUrl, setCachedOriginalUrl } from '../cache/redisCache.js'
import { buildShortUrl, createSlug, normalizeUrl, sanitizeSlug } from '../utils/slug.js'

export function resolveCode(preferredCode, title) {
  const preferred = typeof preferredCode === 'string' ? preferredCode.trim() : ''

  if (preferred) {
    return sanitizeSlug(preferred)
  }

  const fallbackTitle = typeof title === 'string' ? title.trim() : ''

  if (!fallbackTitle) {
    return createSlug()
  }

  const slugFromTitle = fallbackTitle
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32)

  return slugFromTitle || createSlug()
}

export async function getAllLinks() {
  const links = await getAllLinksData()

  return {
    success: true,
    links,
  }
}

export async function createShortLink(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Input must be an object with url')
  }

  const { url } = input

  if (!url) {
    throw new Error('URL is required')
  }

  // Normalize the original URL
  const normalizedUrl = normalizeUrl(url)

  // Reuse existing mapping for same URL instead of creating a new code.
  const existingLink = await queryLinkByOriginalUrl(normalizedUrl)

  if (existingLink) {
    await setCachedOriginalUrl(existingLink.code, existingLink.original_url)

    return {
      success: true,
      code: existingLink.code,
      original_url: existingLink.original_url,
      short_url: existingLink.short_url,
      short_link: existingLink.short_url,
      id: existingLink.id,
      clicks: existingLink.clicks,
      created_at: existingLink.created_at,
      reused: true,
    }
  }

  // Always generate a random slug, retry if collision
  let code
  let attempts = 0
  const maxAttempts = 5
  while (attempts < maxAttempts) {
    code = createSlug()
    const exists = await checkCodeExists(code)
    if (!exists) {
      break
    }
    attempts += 1
  }
  if (attempts === maxAttempts) {
    throw new Error('Failed to generate unique slug after multiple attempts')
  }

  // Build the short URL
  const shortUrl = buildShortUrl(BASE_URL, code)

  // Save to database
  const saved = await addLink({
    code,
    original_url: normalizedUrl,
    short_url: shortUrl
  })

  const reused = saved.code !== code

  await setCachedOriginalUrl(saved.code, normalizedUrl)

  return {
    success: true,
    code: saved.code,
    original_url: saved.original_url,
    short_url: saved.short_url,
    short_link: saved.short_url,
    id: saved.id,
    clicks: saved.clicks,
    created_at: saved.created_at,
    reused,
  }
}

export async function resolveShortLink(code) {
  if (!code || typeof code !== 'string') {
    throw new Error('Code is required')
  }

  const trimmedCode = code.trim()

  if (!trimmedCode) {
    throw new Error('Code is required')
  }

  const cachedOriginalUrl = await getCachedOriginalUrl(trimmedCode)

  if (cachedOriginalUrl) {
    await incrementClicks(trimmedCode)
    return cachedOriginalUrl
  }

  // Query the database for the link
  const link = await queryLinkByCode(trimmedCode)

  await setCachedOriginalUrl(trimmedCode, link.original_url)

  // Increment click counter
  await incrementClicks(trimmedCode)

  // Return the original URL for redirect
  return link.original_url
}

export async function getDashboardSummary() {
  const stats = await getDashboardStats()
  const recentLinks = await getRecentLinks(10)

  return {
    success: true,
    summary: {
      total_links: stats.total_links,
      total_clicks: stats.total_clicks,
      max_clicks: stats.max_clicks,
      avg_clicks: Number(stats.avg_clicks).toFixed(2)
    },
    recent_links: recentLinks
  }
}
import crypto from 'node:crypto'

export function normalizeUrl(value) {
  if (typeof value !== 'string') {
    throw new Error('URL must be a string')
  }

  const trimmed = value.trim()

  if (!trimmed) {
    throw new Error('URL is required')
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  let parsed
  try {
    parsed = new URL(withProtocol)
  } catch {
    throw new Error('Invalid URL')
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Only HTTP and HTTPS URLs are supported')
  }

  parsed.hostname = parsed.hostname.toLowerCase()
  return parsed.toString()
}

export function sanitizeSlug(value) {
  if (typeof value !== 'string') {
    throw new Error('Slug must be a string')
  }

  const normalized = value.trim().toLowerCase()

  if (!normalized) {
    throw new Error('Slug is required')
  }

  if (normalized.length > 32) {
    throw new Error('Slug must be at most 32 characters')
  }

  if (!/^[a-z0-9_-]+$/.test(normalized)) {
    throw new Error('Slug can only contain letters, numbers, hyphens, and underscores')
  }

  return normalized
}

export function createSlug(length = 7) {
  if (!Number.isInteger(length)) {
    throw new Error('Slug length must be an integer')
  }

  if (length < 4 || length > 32) {
    throw new Error('Slug length must be between 4 and 32')
  }

  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let slug = ''

  for (let index = 0; index < length; index += 1) {
    const randomIndex = crypto.randomInt(0, alphabet.length)
    slug += alphabet[randomIndex]
  }

  return slug
}

export function buildShortUrl(baseUrl, code) {
  if (typeof baseUrl !== 'string') {
    throw new Error('Base URL must be a string')
  }

  if (typeof code !== 'string') {
    throw new Error('Slug code must be a string')
  }

  const trimmedBase = baseUrl.trim()
  const trimmedCode = code.trim()

  if (!trimmedBase) {
    throw new Error('Base URL is required')
  }

  if (!trimmedCode) {
    throw new Error('Slug code is required')
  }

  if (!/^[A-Za-z0-9_-]+$/.test(trimmedCode)) {
    throw new Error('Slug code can only contain letters, numbers, hyphens, and underscores')
  }

  let parsedBase
  try {
    parsedBase = new URL(trimmedBase)
  } catch {
    throw new Error('Invalid base URL')
  }

  const basePath = parsedBase.pathname.replace(/\/+$/, '')
  parsedBase.pathname = `${basePath}/${trimmedCode}`

  return parsedBase.toString()
}
import httpClient from './httpClient'
import { dateInputToEndIso, dateInputToStartIso } from '../utils/linkUtils'

function getStatus(row) {
  if (row.is_active === false || row.status === 'disabled') return 'Disabled'
  if (row.starts_at && new Date(row.starts_at) > new Date()) return 'Scheduled'
  if (row.expires_at && new Date(row.expires_at) < new Date()) return 'Expired'
  if (row.is_password_protected || row.status === 'password_protected') return 'Password protected'
  return 'Active'
}

function toUiLink(row) {
  const shortUrl = row.short_url || row.shortUrl
  let title = row.title
  if (!title && row.original_url) {
    try {
      title = new URL(row.original_url).hostname.replace(/^www\./, '')
    } catch {
      title = 'Link'
    }
  }

  return {
    id: row.id,
    title,
    longUrl: row.original_url || row.longUrl,
    shortUrl,
    code: row.code || row.short_code,
    clicks: row.click_count ?? row.clicks ?? 0,
    createdAt: row.created_at ? new Date(row.created_at).toLocaleString() : row.createdAt,
    customAlias: row.custom_alias || row.customAlias || null,
    passwordProtected: Boolean(row.is_password_protected ?? row.passwordProtected ?? row.hasPassword),
    expiresAt: row.expires_at ? new Date(row.expires_at).toLocaleString() : null,
    startsAt: row.starts_at ? new Date(row.starts_at).toLocaleString() : null,
    startsAtIso: row.starts_at || null,
    expiresAtIso: row.expires_at || null,
    expirationType: row.expiration_type || row.expirationType || 'none',
    isActive: row.is_active !== false,
    status: getStatus(row),
    folder: row.folder || null,
    tags: Array.isArray(row.tags) ? row.tags : [],
    canManage: Boolean(row.canManage),
  }
}

function buildExpirationPayload(expirationType, startDate, endDate) {
  if (expirationType !== 'custom_range') {
    return { expirationType }
  }
  return {
    expirationType,
    expirationStartDate: dateInputToStartIso(startDate),
    expirationEndDate: dateInputToEndIso(endDate),
  }
}

function parseAxiosError(error) {
  const data = error?.response?.data
  if (data?.message) return data.message
  if (data?.error) return data.error
  return error.message || 'Request failed'
}

export async function fetchAllLinks() {
  try {
    const { data } = await httpClient.get('/links')
    return Array.isArray(data.links) ? data.links.map(toUiLink) : []
  } catch (error) {
    throw new Error(parseAxiosError(error))
  }
}

export async function createLink(payload) {
  try {
    const body = { ...payload }
    if (payload.expirationType === 'custom_range') {
      Object.assign(body, buildExpirationPayload(payload.expirationType, payload.expirationStartDate, payload.expirationEndDate))
      delete body.expirationStartDate
      delete body.expirationEndDate
    }
    const { data } = await httpClient.post('/createlink', body)
    return toUiLink(data)
  } catch (error) {
    throw new Error(parseAxiosError(error))
  }
}

export async function updateLink(code, payload) {
  try {
    const body = { ...payload }
    if (payload.expirationType === 'custom_range') {
      Object.assign(body, buildExpirationPayload(payload.expirationType, payload.expirationStartDate, payload.expirationEndDate))
      delete body.expirationStartDate
      delete body.expirationEndDate
    }
    const { data } = await httpClient.put(`/links/${code}`, body)
    return toUiLink(data)
  } catch (error) {
    throw new Error(parseAxiosError(error))
  }
}

export async function deleteLink(code) {
  try {
    await httpClient.delete(`/links/${code}`)
    return true
  } catch (error) {
    throw new Error(parseAxiosError(error))
  }
}

export async function bulkLinksAction(action, codes, options = {}) {
  try {
    const { data } = await httpClient.post('/links/bulk', { action, codes, ...options })
    return data
  } catch (error) {
    throw new Error(parseAxiosError(error))
  }
}

export async function fetchDashboardSummary() {
  try {
    const { data } = await httpClient.get('/dashboard')
    return data
  } catch (error) {
    throw new Error(parseAxiosError(error))
  }
}

export async function checkAliasAvailability(alias) {
  try {
    const { data } = await httpClient.get(`/aliases/${encodeURIComponent(alias)}/check`)
    return data
  } catch (error) {
    throw new Error(parseAxiosError(error))
  }
}

export async function fetchLinkMetadata(code) {
  try {
    const { data } = await httpClient.get(`/links/${code}`)
    return toUiLink(data.link)
  } catch (error) {
    throw new Error(parseAxiosError(error))
  }
}

export async function fetchLinkSettings(code) {
  try {
    const { data } = await httpClient.get(`/links/${code}/settings`)
    return toUiLink(data.link)
  } catch (error) {
    throw new Error(parseAxiosError(error))
  }
}

export async function fetchLinkAnalytics(code) {
  try {
    const { data } = await httpClient.get(`/links/${code}/analytics`)
    return data.analytics
  } catch (error) {
    throw new Error(parseAxiosError(error))
  }
}

export async function verifyLinkPassword(code, password) {
  try {
    const { data } = await httpClient.post(`/links/${code}/verify`, { password })
    return data
  } catch (error) {
    throw new Error(parseAxiosError(error))
  }
}

export { buildExpirationPayload, dateInputToStartIso, dateInputToEndIso }

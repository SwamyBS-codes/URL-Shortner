import { buildShortUrl } from './slug.js'
import { BASE_URL } from '../config.js'

export function getLinkStatus(link) {
  const now = new Date()
  if (!link.is_active) return 'disabled'
  if (link.starts_at && new Date(link.starts_at) > now) return 'Scheduled'
  if (link.expires_at && new Date(link.expires_at) < now) return 'expired'
  if (link.is_password_protected) return 'password_protected'
  return 'active'
}

export function formatLinkRow(row, baseUrl = BASE_URL) {
  return {
    id: row.id,
    original_url: row.original_url,
    short_code: row.short_code,
    custom_alias: row.custom_alias,
    code: row.short_code,
    short_url: buildShortUrl(baseUrl, row.short_code),
    title: row.title,
    is_password_protected: row.is_password_protected,
    expires_at: row.expires_at,
    starts_at: row.starts_at,
    expiration_type: row.expiration_type,
    folder: row.folder || null,
    tags: Array.isArray(row.tags) ? row.tags : [],
    click_count: row.click_count,
    clicks: row.click_count,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    status: getLinkStatus(row),
  }
}

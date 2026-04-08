import httpClient from './httpClient'

function toUiLink(row) {
  return {
    id: row.id,
    title: new URL(row.original_url).hostname.replace(/^www\./, ''),
    longUrl: row.original_url,
    shortUrl: row.short_url,
    code: row.code,
    clicks: row.clicks,
    createdAt: new Date(row.created_at).toLocaleString(),
    status: 'Active',
  }
}

function parseAxiosError(error) {
  return error?.response?.data?.error || error.message || 'Request failed'
}

export async function fetchAllLinks() {
  try {
    const { data } = await httpClient.get('/listAllLinks')
    return Array.isArray(data.links) ? data.links.map(toUiLink) : []
  } catch (error) {
    throw new Error(parseAxiosError(error))
  }
}

export async function createLink(payload) {
  let data
  try {
    const response = await httpClient.post('/createlink', payload)
    data = response.data
  } catch (error) {
    throw new Error(parseAxiosError(error))
  }

  return {
    id: data.id,
    title: new URL(data.original_url).hostname.replace(/^www\./, ''),
    longUrl: data.original_url,
    shortUrl: data.short_url,
    code: data.code,
    clicks: data.clicks,
    createdAt: new Date(data.created_at).toLocaleString(),
    status: 'Active',
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

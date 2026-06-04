import httpClient from './httpClient'

const TOKEN_KEY = 'shortify_auth_token'

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token)
  } else {
    localStorage.removeItem(TOKEN_KEY)
  }
}

function parseError(error) {
  const data = error?.response?.data
  if (data?.message) return data.message
  if (data?.error) return data.error
  return error.message || 'Request failed'
}

export async function register({ name, email, password }) {
  try {
    const { data } = await httpClient.post('/auth/register', { name, email, password })
    return data
  } catch (error) {
    throw new Error(parseError(error))
  }
}

export async function login({ email, password }) {
  try {
    const { data } = await httpClient.post('/auth/login', { email, password })
    return data
  } catch (error) {
    throw new Error(parseError(error))
  }
}

export async function fetchCurrentUser() {
  try {
    const { data } = await httpClient.get('/auth/me')
    return data.user
  } catch {
    return null
  }
}

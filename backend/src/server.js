import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { PORT, CLIENT_URL } from './config.js'
import { initRedisCache } from './cache/redisCache.js'
import { setupDatabase } from './setupDb.js'
import {
  createShortLink,
  getDashboardSummary,
  resolveShortLink,
  getLinkMetadata,
  verifyLinkPassword,
  getLinkAnalyticsSummary,
  getAllLinks,
  checkAliasAvailability,
  updateShortLink,
  deleteShortLink,
  bulkUpdateLinks,
  getLinkSettings,
} from './services/linkService.js'
import { getLinkByCode, listLinks } from './data/linkStore.js'
import { extractVisitMetadata } from './utils/visitMetadata.js'
import { optionalAuth } from './middleware/optionalAuth.js'
import { registerUser, loginUser, getUserProfile } from './services/authService.js'

const app = express()
app.set('trust proxy', 1)
app.use(helmet())
app.use(express.json({ limit: '16kb' }))
const rawClientUrls = process.env.CLIENT_URL || ''
const allowedOrigins = rawClientUrls.split(',').map((s) => s.trim()).filter(Boolean)
if (allowedOrigins.length === 0) {
  allowedOrigins.push('http://localhost:5173')
}
// include known production frontend by default
if (!allowedOrigins.includes('https://shortify-urlshortner.vercel.app')) {
  allowedOrigins.push('https://shortify-urlshortner.vercel.app')
}
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
}
app.use(cors(corsOptions))
// Some path-to-regexp versions reject '*' when registering routes.
// Handle preflight OPTIONS requests with the CORS middleware directly instead.
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return cors(corsOptions)(req, res, next)
  }
  next()
})
app.use(optionalAuth)

function handleServiceError(res, error, fallback = 'Request failed') {
  const message = error.message || fallback

  if (error.code === 'INVALID_PASSWORD') {
    return res.status(401).json({ error: message })
  }
  if (error.code === 'EXPIRED') {
    return res.status(410).json({ error: message, code: 'EXPIRED' })
  }
  if (error.code === 'INACTIVE') {
    return res.status(403).json({ error: message, code: 'INACTIVE' })
  }
  if (error.code === 'FORBIDDEN') {
    return res.status(403).json({ error: message })
  }
  if (/already exists/i.test(message)) {
    return res.status(409).json({ error: message })
  }
  if (/required|invalid|must be|unsupported|reserved|unavailable/i.test(message)) {
    return res.status(400).json({ error: message })
  }
  if (/not found/i.test(message)) {
    return res.status(404).json({ error: message })
  }

  return res.status(500).json({ error: message })
}

app.get('/', (req, res) => {
  res.send('URL Shortener backend is running')
})

app.post('/api/auth/register', async (req, res) => {
  try {
    const result = await registerUser(req.body)
    res.json({ success: true, ...result })
  } catch (error) {
    console.error('Registration failed:', error)
    handleServiceError(res, error, 'Registration failed')
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const result = await loginUser(req.body)
    res.json({ success: true, ...result })
  } catch (error) {
    console.error('Login failed:', error)
    handleServiceError(res, error, 'Login failed')
  }
})

app.get('/api/auth/me', async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: true, user: null })
    }
    const user = await getUserProfile(req.user.id)
    res.json({ success: true, user })
  } catch (error) {
    console.error('Profile fetch failed:', error)
    handleServiceError(res, error, 'Failed to fetch profile')
  }
})

app.get('/api/listAllLinks', async (req, res) => {
  try {
    await listLinks(req, res)
  } catch (error) {
    console.error('Error fetching links:', error)
    res.status(500).json({ error: 'Failed to fetch links' })
  }
})

app.get('/api/links', async (req, res) => {
  try {
    const result = await getAllLinks(req.user?.id ?? null)
    res.json(result)
  } catch (error) {
    console.error('Error listing links:', error)
    res.status(500).json({ error: 'Failed to list links' })
  }
})

app.get('/api/getLinkByCode/:code', async (req, res) => {
  try {
    await getLinkByCode(req, res)
  } catch (error) {
    console.error('Error fetching link by code:', error)
    res.status(500).json({ error: 'Failed to fetch link by code' })
  }
})

app.get('/api/aliases/:alias/check', async (req, res) => {
  try {
    const result = await checkAliasAvailability(req.params.alias)
    res.json(result)
  } catch (error) {
    console.error('Error checking alias:', error)
    res.status(500).json({ error: 'Failed to check alias availability' })
  }
})

app.post('/api/links/bulk', async (req, res) => {
  try {
    const result = await bulkUpdateLinks(req.body, req.user?.id ?? null)
    res.json(result)
  } catch (error) {
    console.error('Bulk link action failed:', error)
    handleServiceError(res, error, 'Bulk action failed')
  }
})

app.get('/api/links/:code/settings', async (req, res) => {
  try {
    const settings = await getLinkSettings(req.params.code, req.user?.id ?? null)
    res.json({ success: true, link: settings })
  } catch (error) {
    console.error('Error fetching link settings:', error)
    handleServiceError(res, error, 'Failed to fetch link settings')
  }
})

app.get('/api/links/:code', async (req, res) => {
  try {
    const metadata = await getLinkMetadata(req.params.code, { hideDestination: true })
    res.json({ success: true, link: metadata })
  } catch (error) {
    console.error('Error fetching link metadata:', error)
    handleServiceError(res, error, 'Failed to fetch link metadata')
  }
})

app.post('/api/createlink', async (req, res) => {
  try {
    const result = await createShortLink(req.body, req.user?.id ?? null)
    res.json(result)
  } catch (error) {
    console.error('Error creating short link:', error)
    handleServiceError(res, error, 'Failed to create short link')
  }
})

app.put('/api/links/:code', async (req, res) => {
  try {
    const result = await updateShortLink(req.params.code, req.body, req.user?.id ?? null)
    res.json(result)
  } catch (error) {
    console.error('Error updating link:', error)
    handleServiceError(res, error, 'Failed to update link')
  }
})

app.delete('/api/links/:code', async (req, res) => {
  try {
    const result = await deleteShortLink(req.params.code, req.user?.id ?? null)
    res.json(result)
  } catch (error) {
    console.error('Error deleting link:', error)
    handleServiceError(res, error, 'Failed to delete link')
  }
})

app.post('/api/links/:code/verify', async (req, res) => {
  try {
    const visitMetadata = extractVisitMetadata(req)
    const url = await verifyLinkPassword(req.params.code, req.body.password, visitMetadata)
    res.json({ success: true, redirect_url: url })
  } catch (error) {
    console.error('Password verification failed:', error)
    handleServiceError(res, error, 'Password verification failed')
  }
})

app.get('/api/links/:code/analytics', async (req, res) => {
  try {
    const analytics = await getLinkAnalyticsSummary(req.params.code)
    res.json({ success: true, analytics })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    handleServiceError(res, error, 'Failed to fetch analytics')
  }
})

app.get('/api/dashboard', async (req, res) => {
  try {
    const summary = await getDashboardSummary(req.user?.id ?? null)
    res.json(summary)
  } catch (error) {
    console.error('Error fetching dashboard summary:', error)
    res.status(500).json({ error: 'Failed to fetch dashboard summary' })
  }
})

async function handleRedirect(req, res, next) {
  try {
    const visitMetadata = extractVisitMetadata(req)
    const location = await resolveShortLink(req.params.code, visitMetadata)
    res.redirect(302, location)
  } catch (err) {
    if (err.code === 'PASSWORD_REQUIRED') {
      return res.redirect(`${CLIENT_URL}/access/${req.params.code}`)
    }
    if (err.code === 'EXPIRED') {
      return res.redirect(`${CLIENT_URL}/expired/${req.params.code}`)
    }
    if (err.code === 'NOT_YET_ACTIVE') {
      return res.redirect(`${CLIENT_URL}/scheduled/${req.params.code}`)
    }
    if (err.code === 'INACTIVE') {
      return res.redirect(`${CLIENT_URL}/disabled/${req.params.code}`)
    }
    if (/not found/i.test(err.message)) {
      return res.status(404).json({ error: err.message })
    }
    next(err)
  }
}

app.get('/api/resolveLink/:code', handleRedirect)
app.get('/:code', handleRedirect)

async function startServer() {
  await setupDatabase()
  await initRedisCache()

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})

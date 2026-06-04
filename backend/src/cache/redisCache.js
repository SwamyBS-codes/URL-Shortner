import { createClient } from 'redis'
import { REDIS_TTL_SECONDS, REDIS_URL } from '../config.js'

let client = null
let isReady = false

function keyForCode(code) {
  return `short:code:${code}`
}

export async function initRedisCache() {
  if (!REDIS_URL) {
    console.warn('Redis is disabled: REDIS_URL is not set.')
    return false
  }

  client = createClient({
    url: REDIS_URL,
    socket: {
      reconnectStrategy: () => false,
    },
  })

  client.on('error', (error) => {
    isReady = false
    console.error('Redis error:', error.message)
  })

  try {
    await client.connect()
    isReady = true
    console.log('Redis connected')
    return true
  } catch (error) {
    isReady = false
    client = null
    console.warn('Redis unavailable, continuing without cache:', error.message)
    return false
  }
}

export async function getCachedOriginalUrl(code) {
  if (!isReady || !client) {
    return null
  }

  try {
    return await client.get(keyForCode(code))
  } catch (error) {
    console.warn('Redis get failed:', error.message)
    return null
  }
}

export async function deleteCachedOriginalUrl(code) {
  if (!isReady || !client) {
    return
  }

  try {
    await client.del(keyForCode(code))
  } catch (error) {
    console.warn('Redis delete failed:', error.message)
  }
}

export async function setCachedOriginalUrl(code, originalUrl) {
  if (!isReady || !client) {
    return
  }

  try {
    await client.set(keyForCode(code), originalUrl, {
      EX: REDIS_TTL_SECONDS,
    })
  } catch (error) {
    console.warn('Redis set failed:', error.message)
  }
}

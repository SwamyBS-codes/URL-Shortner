import { verifyToken } from '../utils/token.js'
import { findUserById } from '../data/userStore.js'

export async function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    req.user = null
    return next()
  }

  const token = header.slice(7)
  const payload = verifyToken(token)
  if (!payload?.sub) {
    req.user = null
    return next()
  }

  try {
    const user = await findUserById(Number(payload.sub))
    req.user = user ? { id: user.id, email: user.email, name: user.name } : null
  } catch {
    req.user = null
  }

  next()
}

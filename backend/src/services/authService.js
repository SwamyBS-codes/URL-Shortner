import bcrypt from 'bcryptjs'
import { createUser, findUserByEmail, findUserById } from '../data/userStore.js'
import { signToken } from '../utils/token.js'

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function formatUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.created_at,
  }
}

export async function registerUser({ name, email, password }) {
  if (!email?.trim() || !password) {
    throw new Error('Email and password are required')
  }

  if (!validateEmail(email)) {
    throw new Error('Invalid email address')
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }

  const existing = await findUserByEmail(email)
  if (existing) {
    throw new Error('An account with this email already exists')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await createUser({
    name: name?.trim() || email.split('@')[0],
    email,
    passwordHash,
  })

  const token = signToken(user)
  return { user: formatUser(user), token }
}

export async function loginUser({ email, password }) {
  if (!email?.trim() || !password) {
    throw new Error('Email and password are required')
  }

  const user = await findUserByEmail(email)
  if (!user) {
    throw new Error('Invalid email or password')
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    throw new Error('Invalid email or password')
  }

  const token = signToken(user)
  return { user: formatUser(user), token }
}

export async function getUserProfile(userId) {
  const user = await findUserById(userId)
  if (!user) {
    throw new Error('User not found')
  }
  return formatUser(user)
}

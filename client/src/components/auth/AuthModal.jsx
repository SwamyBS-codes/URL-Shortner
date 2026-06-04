import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, login, register } = useAuth()
  const [mode, setMode] = useState(authModalMode)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (authModalOpen) {
      setMode(authModalMode)
      setError('')
    }
  }, [authModalOpen, authModalMode])

  if (!authModalOpen) return null

  function switchMode(next) {
    setMode(next)
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      if (mode === 'login') {
        await login({ email, password })
      } else {
        await register({ name, email, password })
      }
      setPassword('')
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay auth-modal-overlay" role="dialog" aria-modal="true" onClick={closeAuthModal}>
      <div className="modal-panel auth-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-modal-close" onClick={closeAuthModal} aria-label="Close">
          ×
        </button>

        <h2>{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
        <p className="auth-modal-subtitle">
          {mode === 'login'
            ? 'Optional — sign in to save and manage your links.'
            : 'Optional — create an account to keep your links in one place.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'register' ? (
            <label className="field">
              <span className="field-label">Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                autoComplete="name"
              />
            </label>
          ) : null}

          <label className="field">
            <span className="field-label">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={6}
            />
          </label>

          {error ? <div className="alert alert-error">{error}</div> : null}

          <button type="submit" className="btn btn-primary auth-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? (
            <>
              No account?{' '}
              <button type="button" onClick={() => switchMode('register')}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('login')}>
                Sign in
              </button>
            </>
          )}
        </p>

        <p className="auth-guest-note">You can shorten links without signing in.</p>
      </div>
    </div>
  )
}

export default AuthModal

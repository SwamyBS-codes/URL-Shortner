import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ShortifyLogo from '../ShortifyLogo'
import ThemeToggle from './ThemeToggle'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Shorten', href: '/#shortener' },
  { label: 'My Links', href: '/#links-table' },
]

function AppNavbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { user, isAuthenticated, openAuthModal, logout } = useAuth()

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <ShortifyLogo />
        </Link>

        {isHome ? (
          <nav className="navbar-links" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} className="navbar-link">
                {item.label}
              </a>
            ))}
          </nav>
        ) : (
          <nav className="navbar-links" aria-label="Main navigation">
            <Link to="/" className="navbar-link">
              Dashboard
            </Link>
          </nav>
        )}

        <div className="navbar-right">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="navbar-user">
              <span className="navbar-user-name" title={user.email}>
                {user.name}
              </span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
                Sign out
              </button>
            </div>
          ) : (
            <>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => openAuthModal('login')}>
                Sign in
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => openAuthModal('register')}>
                Sign up
              </button>
            </>
          )}
          <a href="/#shortener" className="btn btn-primary btn-sm navbar-cta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Shorten URL
          </a>
          <button
            type="button"
            className="navbar-burger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="navbar-mobile">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="navbar-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          {isAuthenticated ? (
            <button type="button" className="btn btn-ghost" onClick={() => { logout(); setMenuOpen(false) }}>
              Sign out ({user.name})
            </button>
          ) : (
            <>
              <button type="button" className="btn btn-ghost" onClick={() => { openAuthModal('login'); setMenuOpen(false) }}>
                Sign in
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => { openAuthModal('register'); setMenuOpen(false) }}>
                Sign up
              </button>
            </>
          )}
          <a href="/#shortener" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
            Shorten URL
          </a>
        </div>
      ) : null}
    </header>
  )
}

export default AppNavbar

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
  const [profileOpen, setProfileOpen] = useState(false)
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
            <div className="navbar-profile-wrapper">
              <button
                type="button"
                className="navbar-profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-label="User profile menu"
              >
                <div className="navbar-profile-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </button>
              {profileOpen && (
                <div className="navbar-profile-menu">
                  <div className="navbar-profile-header">
                    <div className="navbar-profile-avatar-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="navbar-profile-name">{user.name}</p>
                      <p className="navbar-profile-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="navbar-profile-divider" />
                  <button
                    type="button"
                    className="navbar-profile-signout"
                    onClick={() => {
                      logout()
                      setProfileOpen(false)
                    }}
                  >
                    Sign out
                  </button>
                </div>
              )}
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
        </div>
      ) : null}
    </header>
  )
}

export default AppNavbar

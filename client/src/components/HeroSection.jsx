import { useLinkWorkspace } from '../context/LinkWorkspaceContext'
import ShortifyLogo from './ShortifyLogo'

function HeroSection() {
  const { statusMessage, loadError, generatedLink, primaryDomain, totalClicks, quickStats } = useLinkWorkspace()

  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <ShortifyLogo compact />
        <h1>Professional URL shortening, built for teams.</h1>
        <p className="hero-text">
          Create branded short links with custom aliases, password protection, expiration controls,
          QR codes, and real-time analytics — all in one modern dashboard.
        </p>

        <div className="hero-actions">
          <a className="primary-action" href="#link-form">
            Create a short link
          </a>
          <a className="secondary-action" href="#links-table">
            Manage links
          </a>
        </div>

        <div className="hero-status-stack" aria-live="polite">
          <div className="status-pill">
            <span className="status-dot" />
            {statusMessage}
          </div>
          {loadError ? <div className="error-pill">{loadError}</div> : null}
        </div>
      </div>

      <div className="hero-art" aria-hidden="true">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="orbit-card main-card">
          <span>Live short link</span>
          <strong>{generatedLink?.shortUrl || '—'}</strong>
          <p>{generatedLink?.title || 'Your link'}</p>
        </div>
        <div className="orbit-card detail-card top-card">
          <span>Resolved domain</span>
          <strong>{primaryDomain || '—'}</strong>
        </div>
        <div className="orbit-card detail-card bottom-card">
          <span>Total clicks</span>
          <strong>{totalClicks.toLocaleString()}</strong>
        </div>
        <div className="orbit-card detail-card side-card">
          <span>Workspace links</span>
          <strong>{quickStats[0]?.value || '0'}</strong>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

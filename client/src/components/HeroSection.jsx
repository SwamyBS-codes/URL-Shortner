import { useLinkWorkspace } from '../context/LinkWorkspaceContext'
import ShortifyLogo from './ShortifyLogo'

function HeroSection() {
  const { statusMessage, loadError, actionError, generatedLink, primaryDomain, totalClicks } = useLinkWorkspace()

  return (
    <section className="hero-panel">
      <div className="hero-copy">
        <ShortifyLogo compact />
        {/* <span className="eyebrow">Shortify suite</span> */}
        <h1>Build short links that look sharp and ship fast.</h1>
        <p className="hero-text">
          Draft, preview, and organize short links in one focused workspace.
          This UI stays fully local so you can iterate quickly on layout and
          interaction before backend integration.
        </p>

        <div className="hero-actions">
          <a className="primary-action" href="#link-form">
            Create a short link
          </a>
          <a className="secondary-action" href="#recent-links">
            Jump to recent links
          </a>
        </div>

        <div className="hero-status-stack" aria-live="polite">
          <div className="status-pill">
            <span className="status-dot" />
            {statusMessage}
          </div>
          {loadError ? <div className="error-pill">{loadError}</div> : null}
          {actionError ? <div className="error-pill error-pill-inline">{actionError}</div> : null}
        </div>
      </div>

      <div className="hero-art" aria-hidden="true">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="orbit-card main-card">
          <span>Live short link</span>
          <strong>{generatedLink.shortUrl}</strong>
          <p>{generatedLink.title}</p>
        </div>
        <div className="orbit-card detail-card top-card">
          <span>Resolved domain</span>
          <strong>{primaryDomain}</strong>
        </div>
        <div className="orbit-card detail-card bottom-card">
          <span>Total clicks</span>
          <strong>{totalClicks.toLocaleString()}</strong>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

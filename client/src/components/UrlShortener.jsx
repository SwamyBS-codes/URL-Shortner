import { useLinkWorkspace } from '../context/LinkWorkspaceContext'
import QrCodePanel from './ui/QrCodePanel'
import StatusBadge from './ui/StatusBadge'
import ExpirationFields from './ui/ExpirationFields'
import PasswordProtectField from './ui/PasswordProtectField'
import { formatDateOnlyDisplay } from '../utils/linkUtils'

function UrlShortener() {
  const {
    longUrl,
    generatedLink,
    setLongUrl,
    createShortLink,
    copyShortLink,
    isCreating,
    actionError,
    customAlias,
    setCustomAlias,
    aliasStatus,
    protectWithPassword,
    setProtectWithPassword,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    expirationType,
    setExpirationType,
    expirationStartDate,
    setExpirationStartDate,
    expirationEndDate,
    setExpirationEndDate,
    linkFolder,
    setLinkFolder,
    linkTagsInput,
    setLinkTagsInput,
    quickStats,
  } = useLinkWorkspace()

  function handleSubmit(event) {
    event.preventDefault()
    createShortLink()
  }

  return (
    <section className="shortener-hero" id="shortener">
      <div className="shortener-hero-bg" aria-hidden="true" />

      <div className="shortener-content">
        <div className="shortener-badge">
          <span className="pulse-dot" />
          Free URL Shortener
        </div>

        <h1 className="shortener-title">
          Shorten your links.
          <br />
          <span className="gradient-text">Track everything.</span>
        </h1>

        <p className="shortener-subtitle">
          Paste a long URL below and get a short, shareable link with QR code, analytics, and
          optional password protection.
        </p>

        <form className="shortener-form" onSubmit={handleSubmit}>
          <div className="url-input-group">
            <div className="url-input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <input
              type="url"
              className="url-input"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Paste your long URL here — https://example.com/very-long-link"
              autoComplete="off"
              required
            />
            <button type="submit" className="btn btn-primary btn-shorten" disabled={isCreating}>
              {isCreating ? (
                <span className="btn-spinner" />
              ) : (
                <>
                  Shorten
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>

          <div className="advanced-panel">
            <h3 className="advanced-heading">Link options</h3>
            <div className="advanced-grid">
                <label className="field">
                  <span className="field-label">Custom alias</span>
                  <input
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder="my-link"
                  />
                  {aliasStatus ? (
                    <span className={`field-hint ${aliasStatus.available ? 'success' : 'error'}`}>
                      {aliasStatus.available ? '✓ Available' : aliasStatus.reason}
                    </span>
                  ) : null}
                </label>

                <label className="field">
                  <span className="field-label">Expiration</span>
                  <select value={expirationType} onChange={(e) => setExpirationType(e.target.value)}>
                    <option value="none">Never expires</option>
                    <option value="1h">1 hour</option>
                    <option value="6h">6 hours</option>
                    <option value="12h">12 hours</option>
                    <option value="1d">1 day</option>
                    <option value="7d">7 days</option>
                    <option value="30d">30 days</option>
                    <option value="custom_range">Custom date range</option>
                  </select>
                </label>
              </div>

              <div className="advanced-grid">
                <label className="field">
                  <span className="field-label">Folder</span>
                  <input
                    type="text"
                    value={linkFolder}
                    onChange={(e) => setLinkFolder(e.target.value)}
                    placeholder="e.g. Marketing"
                  />
                </label>
                <label className="field">
                  <span className="field-label">Tags</span>
                  <input
                    type="text"
                    value={linkTagsInput}
                    onChange={(e) => setLinkTagsInput(e.target.value)}
                    placeholder="campaign, social (comma-separated)"
                  />
                </label>
              </div>

              <PasswordProtectField
                protectWithPassword={protectWithPassword}
                onProtectChange={setProtectWithPassword}
                password={password}
                onPasswordChange={setPassword}
                showPassword={showPassword}
                onToggleShowPassword={() => setShowPassword((v) => !v)}
              />

              <ExpirationFields
                expirationType={expirationType}
                startDate={expirationStartDate}
                endDate={expirationEndDate}
                onStartDateChange={setExpirationStartDate}
                onEndDateChange={setExpirationEndDate}
              />
          </div>

          {actionError ? <div className="alert alert-error">{actionError}</div> : null}
        </form>

        {generatedLink?.shortUrl ? (
          <div className="result-card">
            <div className="result-header">
              <div className="result-success-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div>
                <p className="result-label">Your short link is ready</p>
                <a href={generatedLink.shortUrl} target="_blank" rel="noreferrer" className="result-url">
                  {generatedLink.shortUrl}
                </a>
              </div>
              <StatusBadge status={generatedLink.status} />
            </div>

            <div className="result-actions">
              <button type="button" className="btn btn-primary" onClick={() => copyShortLink(generatedLink.shortUrl)}>
                Copy link
              </button>
              <a href={generatedLink.shortUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">
                Open
              </a>
            </div>

            <div className="result-footer">
              <QrCodePanel value={generatedLink.shortUrl} size={120} />
              <div className="result-meta">
                <div>
                  <span>Code</span>
                  <strong>{generatedLink.code}</strong>
                </div>
                <div>
                  <span>Clicks</span>
                  <strong>{generatedLink.clicks}</strong>
                </div>
                <div>
                  <span>Created</span>
                  <strong>{generatedLink.createdAt}</strong>
                </div>
                {(generatedLink.startsAt || generatedLink.expiresAt) && (
                  <div>
                    <span>Active window</span>
                    <strong>
                      {formatDateOnlyDisplay(generatedLink.startsAtIso || generatedLink.startsAt) || 'Now'} —{' '}
                      {formatDateOnlyDisplay(generatedLink.expiresAtIso || generatedLink.expiresAt) || 'No end'}
                    </strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div className="shortener-stats">
          {quickStats.map((stat) => (
            <div className="stat-pill" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UrlShortener

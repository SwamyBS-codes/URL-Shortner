import { useLinkWorkspace } from '../context/LinkWorkspaceContext'
import QrCodePanel from './ui/QrCodePanel'
import StatusBadge from './ui/StatusBadge'

function LinkBuilderSection() {
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
  } = useLinkWorkspace()

  function handleSubmit(event) {
    event.preventDefault()
    createShortLink()
  }

  return (
    <section className="workspace-section">
      <form id="link-form" className="panel form-panel" onSubmit={handleSubmit}>
        <div className="panel-header">
          <span className="panel-tag">Generator</span>
          <h2>Create a short link</h2>
        </div>

        <label>
          Destination URL
          <input
            type="url"
            value={longUrl}
            onChange={(event) => setLongUrl(event.target.value)}
            placeholder="https://example.com/very-long-url"
            autoComplete="off"
            required
          />
        </label>

        <label>
          Custom alias (optional)
          <input
            type="text"
            value={customAlias}
            onChange={(event) => setCustomAlias(event.target.value)}
            placeholder="my-portfolio"
            autoComplete="off"
          />
          {aliasStatus ? (
            <span className={`alias-status ${aliasStatus.available ? 'available' : 'taken'}`}>
              {aliasStatus.available ? '✓ Available' : `✗ ${aliasStatus.reason}`}
            </span>
          ) : customAlias.trim().length > 0 && customAlias.trim().length < 4 ? (
            <span className="alias-status hint">Minimum 4 characters</span>
          ) : null}
        </label>

        <div className="field-grid">
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={protectWithPassword}
              onChange={(event) => setProtectWithPassword(event.target.checked)}
            />
            Password protect
          </label>

          <label>
            Expiration
            <select value={expirationType} onChange={(event) => setExpirationType(event.target.value)}>
              <option value="none">Never</option>
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

        {protectWithPassword ? (
          <label>
            Access password
            <div className="password-field">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter a secure password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
        ) : null}

        {expirationType === 'custom_range' ? (
          <div className="date-range-grid">
            <label>
              Start date
              <input
                type="datetime-local"
                value={expirationStartDate}
                onChange={(event) => setExpirationStartDate(event.target.value)}
                required
              />
            </label>
            <label>
              End date
              <input
                type="datetime-local"
                value={expirationEndDate}
                onChange={(event) => setExpirationEndDate(event.target.value)}
                required
              />
            </label>
          </div>
        ) : null}

        {actionError ? <div className="error-pill">{actionError}</div> : null}

        <button className="form-button" type="submit" disabled={isCreating}>
          {isCreating ? 'Creating…' : 'Generate short link'}
        </button>
      </form>

      <aside className="panel preview-panel">
        <div className="panel-header">
          <span className="panel-tag">Preview</span>
          <h2>Generated link</h2>
        </div>

        {generatedLink ? (
          <>
            <div className="preview-card">
              <span className="preview-label">Short URL</span>
              <strong className="preview-short-url">{generatedLink.shortUrl}</strong>
              <p className="preview-long-url">{generatedLink.longUrl}</p>
              <StatusBadge status={generatedLink.status} />

              <QrCodePanel value={generatedLink.shortUrl} size={148} />

              <div className="preview-actions">
                <button type="button" onClick={() => copyShortLink(generatedLink.shortUrl)}>
                  Copy link
                </button>
                <a href={generatedLink.shortUrl} target="_blank" rel="noreferrer noopener">
                  Open link
                </a>
              </div>
            </div>

            <div className="preview-meta">
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
            </div>
          </>
        ) : (
          <div className="preview-empty">
            <p>Your generated link and QR code will appear here.</p>
          </div>
        )}
      </aside>
    </section>
  )
}

export default LinkBuilderSection

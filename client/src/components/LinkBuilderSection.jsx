import { useLinkWorkspace } from '../context/LinkWorkspaceContext'

function LinkBuilderSection() {
  const {
    longUrl,
    generatedLink,
    setLongUrl,
    createShortLink,
    copyShortLink,
    isCreating,
    actionError,
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
          <h2>Short link builder</h2>
        </div>

        <label>
          Destination URL
          <input
            type="url"
            value={longUrl}
            onChange={(event) => setLongUrl(event.target.value)}
            placeholder="Enter the long URL"
            autoComplete="off"
          />
        </label>

        <div className="form-note">
          Use this panel as a pure UI sandbox: shape labels, helper text, and
          field grouping without relying on API responses.
        </div>

        {actionError ? <div className="error-pill">{actionError}</div> : null}

        <button className="form-button" type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Generate short link'}
        </button>
      </form>

      <aside className="panel preview-panel">
        <div className="panel-header">
          <span className="panel-tag">Preview</span>
          <h2>Generated link card</h2>
        </div>

        <div className="preview-card">
          <span className="preview-label">Short URL</span>
          <strong>{generatedLink.shortUrl}</strong>
          <p>{generatedLink.longUrl}</p>

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
            <span>Status</span>
            <strong>{generatedLink.status}</strong>
          </div>
          <div>
            <span>Created</span>
            <strong>{generatedLink.createdAt}</strong>
          </div>
        </div>
      </aside>
    </section>
  )
}

export default LinkBuilderSection

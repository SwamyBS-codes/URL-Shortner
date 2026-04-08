import { useLinkWorkspace } from '../context/LinkWorkspaceContext'

function TimelineSection() {
  const {
    filteredLinks,
    links,
    primaryDomain,
    generatedLink,
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    clearFilters,
    copyShortLink,
  } = useLinkWorkspace()

  const hasLinks = links.length > 0
  const hasFilteredLinks = filteredLinks.length > 0

  return (
    <section className="workspace-section" id="recent-links">
      <article className="panel list-panel">
        <div className="panel-header">
          <span className="panel-tag">Recent links</span>
          <h2>Workspace timeline</h2>
        </div>

        <div className="timeline-toolbar">
          <label className="timeline-search">
            <span>Search</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search title, URL, short code..."
            />
          </label>

          <label className="timeline-filter">
            <span>Filter</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="draft">Draft</option>
            </select>
          </label>

          <button type="button" className="timeline-clear" onClick={clearFilters}>
            Clear
          </button>
        </div>

        <div className="link-list">
          {!hasLinks ? (
            <div className="empty-state">
              <strong>No links yet</strong>
              <p>Create your first short link to see it appear here.</p>
            </div>
          ) : !hasFilteredLinks ? (
            <div className="empty-state">
              <strong>No matching links</strong>
              <p>Try a different search term or clear the filters.</p>
              <button type="button" className="timeline-clear timeline-clear-inline" onClick={clearFilters}>
                Reset filters
              </button>
            </div>
          ) : filteredLinks.map((link) => (
            <article className="link-row" key={link.id}>
              <div className="link-main">
                <div className="link-title-row">
                  <h3>{link.title}</h3>
                  <span className="link-click-pill">{link.clicks.toLocaleString()} clicks</span>
                </div>
                <p className="link-url">{link.longUrl}</p>
                <div className="link-url-meta">
                  <span>Short URL</span>
                  <strong>{link.shortUrl}</strong>
                </div>
              </div>
              <div className="link-side-meta">
                <span>Created</span>
                <strong>{link.createdAt}</strong>
                <span>Code</span>
                <strong>{link.code}</strong>
                <div className="link-actions-row">
                  <button type="button" onClick={() => copyShortLink(link.shortUrl)}>Copy</button>
                  <a href={link.shortUrl} target="_blank" rel="noreferrer noopener">
                    Open
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </article>

      <article className="panel api-panel">
        <div className="panel-header">
          <span className="panel-tag">Layout notes</span>
          <h2>Structure checklist</h2>
        </div>

        <ul className="api-list">
          <li>
            <code>01</code>
            <div>
              <strong>Hero priorities</strong>
              <p>Keep one bold headline, one supporting paragraph, and two actions.</p>
            </div>
          </li>
          <li>
            <code>02</code>
            <div>
              <strong>Builder + preview</strong>
              <p>Keep inputs and output side by side to show immediate feedback.</p>
            </div>
          </li>
          <li>
            <code>03</code>
            <div>
              <strong>History + guidance</strong>
              <p>Use one list for recency and one card for usage guidance.</p>
            </div>
          </li>
        </ul>

        <div className="workflow-box">
          <h3>Next UI passes</h3>
          <ol>
            <li>Add filter chips for Active, Draft, and Scheduled links.</li>
            <li>Enable inline edits for title and custom slug.</li>
            <li>Display empty states and lightweight validation hints.</li>
          </ol>
        </div>

        <div className="workflow-box">
          <h3>Live snapshot</h3>
          <ol>
            <li>Current primary domain: {primaryDomain}</li>
            <li>Latest short code: {generatedLink.code}</li>
            <li>Total links in memory: {links.length}</li>
          </ol>
        </div>
      </article>
    </section>
  )
}

export default TimelineSection

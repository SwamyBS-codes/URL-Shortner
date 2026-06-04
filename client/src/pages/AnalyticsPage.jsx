import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchLinkAnalytics } from '../api/linksApi'
import AppNavbar from '../components/layout/AppNavbar'
import AnalyticsCharts from '../components/analytics/AnalyticsCharts'
import SkeletonLoader from '../components/ui/SkeletonLoader'
import QrCodePanel from '../components/ui/QrCodePanel'

function AnalyticsPage() {
  const { code } = useParams()
  const [analytics, setAnalytics] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const data = await fetchLinkAnalytics(code)
        if (isMounted) setAnalytics(data)
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load analytics')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [code])

  const shortUrl = analytics?.url?.shortUrl || analytics?.url?.short_url

  return (
    <div className="page">
      <AppNavbar />
      <main className="container analytics-page">
        <div className="page-header">
          <div>
            <Link to="/#links-table" className="back-link">
              ← Back to links
            </Link>
            <h1>Link Analytics</h1>
            {shortUrl ? <p style={{ color: 'var(--muted)', marginTop: 4 }}>{shortUrl}</p> : null}
          </div>
          {shortUrl ? <QrCodePanel value={shortUrl} size={100} /> : null}
        </div>

        {isLoading ? <SkeletonLoader rows={4} /> : null}
        {error ? <div className="alert alert-error">{error}</div> : null}
        {analytics ? <AnalyticsCharts analytics={analytics} /> : null}
      </main>
    </div>
  )
}

export default AnalyticsPage

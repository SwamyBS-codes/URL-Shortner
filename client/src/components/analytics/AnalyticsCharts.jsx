import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444']

function formatBreakdown(items = []) {
  return items.map((item) => ({
    name: item.label || 'Unknown',
    value: item.count,
  }))
}

function formatTimeline(items = []) {
  return items.map((item) => ({
    date: new Date(item.day).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    clicks: item.clicks,
  }))
}

function AnalyticsCharts({ analytics }) {
  const { summary, breakdown, clicks_over_time: timeline, visits } = analytics

  const deviceData = formatBreakdown(breakdown?.devices)
  const browserData = formatBreakdown(breakdown?.browsers)
  const timelineData = formatTimeline(timeline)

  return (
    <div className="analytics-layout">
      <div className="stats-grid">
        <div className="stat-card">
          <span>Total clicks</span>
          <strong>{Number(summary.total_clicks).toLocaleString()}</strong>
        </div>
        <div className="stat-card">
          <span>Unique visitors</span>
          <strong>{Number(summary.unique_visitors).toLocaleString()}</strong>
        </div>
        <div className="stat-card">
          <span>Last accessed</span>
          <strong style={{ fontSize: '0.9375rem' }}>
            {summary.last_accessed ? new Date(summary.last_accessed).toLocaleString() : 'Never'}
          </strong>
        </div>
        <div className="stat-card">
          <span>Created</span>
          <strong style={{ fontSize: '0.9375rem' }}>
            {new Date(summary.created_at).toLocaleString()}
          </strong>
        </div>
        <div className="stat-card">
          <span>Expires</span>
          <strong style={{ fontSize: '0.9375rem' }}>
            {summary.expires_at ? new Date(summary.expires_at).toLocaleString() : 'Never'}
          </strong>
        </div>
      </div>

      {timelineData.length > 0 ? (
        <article className="chart-panel">
          <h2>Clicks over time</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted)" fontSize={12} />
              <YAxis stroke="var(--muted)" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8 }} />
              <Line type="monotone" dataKey="clicks" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </article>
      ) : null}

      <div className="chart-grid">
        {deviceData.length > 0 ? (
          <article className="chart-panel">
            <h2>Devices</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={deviceData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {deviceData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </article>
        ) : null}

        {browserData.length > 0 ? (
          <article className="chart-panel">
            <h2>Browsers</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={browserData}>
                <XAxis dataKey="name" stroke="var(--muted)" fontSize={11} />
                <YAxis stroke="var(--muted)" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </article>
        ) : null}
      </div>

      <section className="links-section">
        <div className="section-header">
          <h2>Recent visits</h2>
          <p>Latest click activity for this link.</p>
        </div>
        {visits.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No visits recorded yet.</p>
        ) : (
          <div className="table-scroll">
            <table className="links-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Device</th>
                  <th>Browser</th>
                  <th>OS</th>
                  <th>Country</th>
                  <th>Referrer</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit, index) => (
                  <tr key={index}>
                    <td>{new Date(visit.visited_at).toLocaleString()}</td>
                    <td>{visit.device || '—'}</td>
                    <td>{visit.browser || '—'}</td>
                    <td>{visit.os || '—'}</td>
                    <td>{visit.country || '—'}</td>
                    <td className="cell-url">{visit.referrer || 'Direct'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default AnalyticsCharts

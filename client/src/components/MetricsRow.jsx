import { useLinkWorkspace } from '../context/LinkWorkspaceContext'

function MetricsRow() {
  const { quickStats } = useLinkWorkspace()

  return (
    <section className="metric-row" aria-label="Summary metrics">
      {quickStats.map((stat) => (
        <article className="metric-card" key={stat.label}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </article>
      ))}
    </section>
  )
}

export default MetricsRow

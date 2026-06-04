import { Link } from 'react-router-dom'
import ShortifyLogo from '../ShortifyLogo'

function LinkStatusLayout({ icon, tone = 'warn', title, description, children, ctaLabel = 'Go to Shortify', ctaTo = '/' }) {
  return (
    <main className="standalone-page">
      <div className={`standalone-card status-card status-${tone}`}>
        <ShortifyLogo />
        <div className={`standalone-icon ${tone}`}>{icon}</div>
        <h1>{title}</h1>
        <p className="status-description">{description}</p>
        {children}
        <Link to={ctaTo} className="btn btn-primary status-cta">
          {ctaLabel}
        </Link>
      </div>
    </main>
  )
}

export default LinkStatusLayout

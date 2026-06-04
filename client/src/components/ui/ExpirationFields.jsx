import { getLocalTimezoneLabel } from '../../utils/linkUtils'
import OnboardingHint from './OnboardingHint'
import Tooltip from './Tooltip'

function ExpirationFields({
  expirationType,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  showOnboarding = true,
  className = '',
}) {
  if (expirationType !== 'custom_range') return null

  const tz = getLocalTimezoneLabel()

  return (
    <div className={`expiration-fields ${className}`.trim()}>
      {showOnboarding ? (
        <OnboardingHint storageKey="shortify_hint_date_range" title="Custom date range">
          <p>
            Your link is <strong>only active between</strong> the start and end dates you pick. Before the start
            date, visitors see a &quot;not active yet&quot; page; after the end date, the link expires.
          </p>
        </OnboardingHint>
      ) : null}

      <p className="timezone-hint">
        <Tooltip content={`Dates use midnight–end-of-day in ${tz}. Active window: start day 12:00 AM through end day 11:59 PM.`}>
          <span className="timezone-hint-label">ℹ️ Dates are in your local timezone ({tz})</span>
        </Tooltip>
      </p>

      <div className="date-range-grid">
        <label className="field">
          <span className="field-label">Start date</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span className="field-label">End date</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            required
          />
        </label>
      </div>
    </div>
  )
}

export default ExpirationFields

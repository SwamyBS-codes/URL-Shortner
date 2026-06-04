const STATUS_MAP = {
  Active: 'badge-active',
  Expired: 'badge-expired',
  Scheduled: 'badge-scheduled',
  'Password protected': 'badge-protected',
  Disabled: 'badge-disabled',
}

function StatusBadge({ status }) {
  const className = STATUS_MAP[status] || 'badge-default'
  return <span className={`status-badge ${className}`}>{status}</span>
}

export default StatusBadge

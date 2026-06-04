function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="64" height="64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <path d="M20 32h24M32 20v24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
        </svg>
      </div>
      <strong>{title}</strong>
      <p>{description}</p>
      {action}
    </div>
  )
}

export default EmptyState

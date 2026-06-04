function ShortifyLogo({ compact = false }) {
  return (
    <div className={`logo${compact ? ' logo-compact' : ''}`}>
      <div className="logo-icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="32" height="32" fill="none">
          <rect width="32" height="32" rx="10" fill="url(#logoGrad)" />
          <path
            d="M11 12.5c0-1.93 1.57-3.5 3.5-3.5H19c1.93 0 3.5 1.57 3.5 3.5S20.93 16 19 16h-4.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5H19.5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M21 19.5c0 1.93-1.57 3.5-3.5 3.5H13c-1.93 0-3.5-1.57-3.5-3.5S11.07 16 13 16h4.5c.83 0 1.5-.67 1.5-1.5S18.33 13 17.5 13H12.5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="logo-text">Shortify</span>
    </div>
  )
}

export default ShortifyLogo

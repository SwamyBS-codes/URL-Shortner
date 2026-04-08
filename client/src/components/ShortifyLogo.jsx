function ShortifyLogo({ compact = false }) {
  return (
    <div className={`shortify-logo${compact ? ' shortify-logo-compact' : ''}`}>
      <div className="shortify-logo-mark" aria-hidden="true">
        <svg viewBox="0 0 48 48" className="shortify-logo-icon" role="presentation" focusable="false">
          <path d="M15 17c0-3.9 3.1-7 7-7h10.5C37 10 40 13 40 16.5S37 23 32.5 23H22c-2.2 0-4 1.8-4 4s1.8 4 4 4h11.4" />
          <path d="M33 31c0 3.9-3.1 7-7 7H15.5C11 38 8 35 8 31.5S11 25 15.5 25H26c2.2 0 4-1.8 4-4s-1.8-4-4-4H14.6" />
        </svg>
      </div>
      <div className="shortify-logo-text">
        <strong>Shortify</strong>
        {/* {!compact ? <span>Branded short links</span> : null} */}
      </div>
    </div>
  )
}

export default ShortifyLogo

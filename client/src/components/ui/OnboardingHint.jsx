import { useEffect, useState } from 'react'

function OnboardingHint({ storageKey, title, children, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!storageKey) {
      setVisible(true)
      return
    }
    const dismissed = localStorage.getItem(storageKey)
    setVisible(!dismissed)
  }, [storageKey])

  function dismiss() {
    if (storageKey) {
      localStorage.setItem(storageKey, '1')
    }
    setVisible(false)
    onDismiss?.()
  }

  if (!visible) return null

  return (
    <div className="onboarding-hint" role="note">
      <div className="onboarding-hint-header">
        <strong>{title}</strong>
        <button type="button" className="onboarding-hint-dismiss" onClick={dismiss} aria-label="Dismiss tip">
          ×
        </button>
      </div>
      <div className="onboarding-hint-body">{children}</div>
    </div>
  )
}

export default OnboardingHint

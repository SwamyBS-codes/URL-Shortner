import OnboardingHint from './OnboardingHint'

function PasswordProtectField({
  protectWithPassword,
  onProtectChange,
  password,
  onPasswordChange,
  showPassword,
  onToggleShowPassword,
  showOnboarding = true,
  passwordLabel = 'Password',
  newPasswordHint,
}) {
  return (
    <>
      {showOnboarding && protectWithPassword ? (
        <OnboardingHint storageKey="shortify_hint_password" title="Password protection">
          <p>
            Visitors must enter this password before they are redirected. The destination URL stays hidden until
            they unlock the link.
          </p>
        </OnboardingHint>
      ) : null}

      <label className="checkbox-row">
        <input type="checkbox" checked={protectWithPassword} onChange={(e) => onProtectChange(e.target.checked)} />
        Password protect this link
      </label>

      {protectWithPassword ? (
        <label className="field">
          <span className="field-label">{passwordLabel}</span>
          {newPasswordHint ? <span className="field-hint">{newPasswordHint}</span> : null}
          <div className="password-row">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Enter password"
              autoComplete="new-password"
            />
            <button type="button" className="btn btn-ghost btn-sm" onClick={onToggleShowPassword}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </label>
      ) : null}
    </>
  )
}

export default PasswordProtectField

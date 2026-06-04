import { useId, useState } from 'react'

function Tooltip({ content, children, placement = 'top' }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <span
      className={`tooltip-wrap tooltip-${placement}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span className="tooltip-trigger" aria-describedby={open ? id : undefined} tabIndex={0}>
        {children}
      </span>
      {open ? (
        <span id={id} role="tooltip" className="tooltip-bubble">
          {content}
        </span>
      ) : null}
    </span>
  )
}

export default Tooltip

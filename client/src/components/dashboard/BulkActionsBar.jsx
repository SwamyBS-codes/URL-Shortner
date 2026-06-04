import { useState } from 'react'

function BulkActionsBar({ selectedCount, onClear, onDelete, onDisable, onEnable, onExtend, isBusy }) {
  const [extendDays, setExtendDays] = useState('7')

  if (selectedCount === 0) return null

  return (
    <div className="bulk-actions-bar" role="toolbar" aria-label="Bulk actions">
      <span className="bulk-count">
        {selectedCount} selected
      </span>
      <button type="button" className="btn btn-ghost btn-sm" onClick={onClear} disabled={isBusy}>
        Clear
      </button>
      <button type="button" className="btn btn-secondary btn-sm" onClick={onDisable} disabled={isBusy}>
        Disable
      </button>
      <button type="button" className="btn btn-secondary btn-sm" onClick={onEnable} disabled={isBusy}>
        Enable
      </button>
      <div className="bulk-extend">
        <label>
          <span className="sr-only">Extend by days</span>
          <input
            type="number"
            min="1"
            max="365"
            value={extendDays}
            onChange={(e) => setExtendDays(e.target.value)}
            disabled={isBusy}
          />
        </label>
        <span>days</span>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={isBusy}
          onClick={() => onExtend(Number(extendDays) || 7)}
        >
          Extend expiry
        </button>
      </div>
      <button type="button" className="btn danger-btn btn-sm" onClick={onDelete} disabled={isBusy}>
        Delete
      </button>
    </div>
  )
}

export default BulkActionsBar

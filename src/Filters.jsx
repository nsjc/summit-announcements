// Shared "Sent to" / "Type" filter bar used by both the manager and employee views.
export function matchesAudience(announcement, audience) {
  if (audience === 'all') return announcement.target === 'all'
  if (audience === 'store') return announcement.target !== 'all'
  return true
}

export default function Filters({ storeName, audience, type, typeOptions, onAudienceChange, onTypeChange }) {
  const active = audience !== 'any' || type !== 'any'

  return (
    <div className="filters">
      <label>
        <span>Sent to</span>
        <select value={audience} onChange={(e) => onAudienceChange(e.target.value)}>
          <option value="any">Any audience</option>
          <option value="all">All stores</option>
          <option value="store">{storeName} only</option>
        </select>
      </label>
      <label>
        <span>Type</span>
        <select value={type} onChange={(e) => onTypeChange(e.target.value)}>
          <option value="any">All types</option>
          {typeOptions.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      {active && (
        <button
          className="link"
          onClick={() => {
            onAudienceChange('any')
            onTypeChange('any')
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

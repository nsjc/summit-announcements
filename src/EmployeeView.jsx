import { useState } from 'react'
import { storeById } from './data'
import { authorLabel, shortDate, targetLabel, timeAgo } from './format'
import Filters, { matchesAudience } from './Filters'

export default function EmployeeView({ employee, data, onAcknowledge }) {
  const store = storeById(employee.storeId)
  const ackedAt = (a) => data.acks[a.id]?.[employee.id]
  const [audienceFilter, setAudienceFilter] = useState('any')
  const [typeFilter, setTypeFilter] = useState('any')

  const feed = data.announcements
    .filter((a) => a.target === 'all' || a.target === employee.storeId)
    .sort((a, b) => b.createdAt - a.createdAt)
  const allNeedsAck = feed.filter((a) => a.important && !ackedAt(a))

  const visible = feed.filter((a) => {
    if (!matchesAudience(a, audienceFilter)) return false
    if (typeFilter === 'important' && !a.important) return false
    if (typeFilter === 'pending' && !allNeedsAck.includes(a)) return false
    if (typeFilter === 'info' && a.important) return false
    return true
  })
  const needsAck = visible.filter((a) => allNeedsAck.includes(a))
  const rest = visible.filter((a) => !allNeedsAck.includes(a))

  return (
    <>
      <section className="page-head">
        <div>
          <h1>Hi, {employee.name.split(' ')[0]}</h1>
          <p className="muted">
            {employee.title} · {store.name}
          </p>
        </div>
      </section>

      <Filters
        storeName={store.name}
        audience={audienceFilter}
        type={typeFilter}
        typeOptions={[
          ['important', 'Important'],
          ['pending', 'Needs my acknowledgment'],
          ['info', 'Info only'],
        ]}
        onAudienceChange={setAudienceFilter}
        onTypeChange={setTypeFilter}
      />

      {allNeedsAck.length === 0 && (
        <div className="notice">✓ You’re all caught up on important updates.</div>
      )}

      {needsAck.length > 0 && (
        <>
          <h2 className="section-title attention">
            📌 Needs your acknowledgment ({needsAck.length})
          </h2>
          {needsAck.map((a) => (
            <FeedItem key={a.id} announcement={a} pinned onAcknowledge={() => onAcknowledge(a.id, employee.id)} />
          ))}
        </>
      )}

      {visible.length === 0 ? (
        <p className="empty">No updates match these filters.</p>
      ) : (
        rest.length > 0 && (
          <>
            <h2 className="section-title">
              {needsAck.length > 0 ? 'Other updates' : 'All updates'} ({rest.length})
            </h2>
            {rest.map((a) => (
              <FeedItem key={a.id} announcement={a} ackedAt={ackedAt(a)} />
            ))}
          </>
        )
      )}
    </>
  )
}

function FeedItem({ announcement: a, pinned, ackedAt, onAcknowledge }) {
  return (
    <article className={`card announcement ${pinned ? 'is-pinned' : ''}`}>
      <div className="meta">
        {a.important && <span className="badge important">Important</span>}
        <span className="badge">{targetLabel(a.target)}</span>
        <span className="muted">{timeAgo(a.createdAt)}</span>
      </div>
      <h3>{a.title}</h3>
      <p className="byline">From {authorLabel(a.authorId)}</p>
      <p className="message">{a.message}</p>
      {pinned && (
        <button className="btn primary block" onClick={onAcknowledge}>
          Got it
        </button>
      )}
      {ackedAt && <p className="acked">✓ You acknowledged this on {shortDate(ackedAt)}</p>}
    </article>
  )
}

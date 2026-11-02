import { storeById } from './data'
import { authorLabel, shortDate, targetLabel, timeAgo } from './format'

export default function EmployeeView({ employee, data, onAcknowledge }) {
  const store = storeById(employee.storeId)
  const ackedAt = (a) => data.acks[a.id]?.[employee.id]

  const feed = data.announcements
    .filter((a) => a.target === 'all' || a.target === employee.storeId)
    .sort((a, b) => b.createdAt - a.createdAt)
  const needsAck = feed.filter((a) => a.important && !ackedAt(a))
  const rest = feed.filter((a) => !needsAck.includes(a))

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

      {needsAck.length > 0 ? (
        <>
          <h2 className="section-title attention">
            📌 Needs your acknowledgment ({needsAck.length})
          </h2>
          {needsAck.map((a) => (
            <FeedItem key={a.id} announcement={a} pinned onAcknowledge={() => onAcknowledge(a.id, employee.id)} />
          ))}
        </>
      ) : (
        <div className="notice">✓ You’re all caught up on important updates.</div>
      )}

      <h2 className="section-title">All updates</h2>
      {rest.length === 0 && <p className="empty">Nothing else right now.</p>}
      {rest.map((a) => (
        <FeedItem key={a.id} announcement={a} ackedAt={ackedAt(a)} />
      ))}
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

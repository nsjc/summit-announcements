import { useState } from 'react'
import { EMPLOYEES, STORES, storeById } from './data'
import { authorLabel, shortDate, targetLabel, timeAgo } from './format'
import Filters, { matchesAudience } from './Filters'

export default function ManagerView({ manager, data, onPost, onArchive, onRestore, onDelete }) {
  const store = storeById(manager.storeId)
  const [showForm, setShowForm] = useState(false)
  const [notice, setNotice] = useState('')
  const [audienceFilter, setAudienceFilter] = useState('any')
  const [typeFilter, setTypeFilter] = useState('any')

  const relevant = data.announcements.filter((a) => a.target === 'all' || a.target === manager.storeId)
  const forMyStore = relevant.filter((a) => !a.archivedAt).sort((a, b) => b.createdAt - a.createdAt)
  const archived = relevant.filter((a) => a.archivedAt).sort((a, b) => b.archivedAt - a.archivedAt)

  function showNotice(text) {
    setNotice(text)
    setTimeout(() => setNotice(''), 4000)
  }

  function handleArchive(a) {
    onArchive(a.id)
    showNotice(`“${a.title}” moved to Archived. Employees no longer see it.`)
  }

  function handleRestore(a) {
    onRestore(a.id)
    showNotice(`“${a.title}” restored. Employees can see it again.`)
  }

  const visible = forMyStore.filter((a) => {
    if (!matchesAudience(a, audienceFilter)) return false
    if (typeFilter === 'important' && !a.important) return false
    if (typeFilter === 'info' && a.important) return false
    if (typeFilter === 'pending') {
      const acks = data.acks[a.id] ?? {}
      const myTeam = EMPLOYEES.filter((e) => e.storeId === manager.storeId)
      if (!a.important || myTeam.every((e) => acks[e.id])) return false
    }
    return true
  })
  const filtered = audienceFilter !== 'any' || typeFilter !== 'any'

  function handlePost(announcement) {
    onPost(announcement)
    setShowForm(false)
    const count = EMPLOYEES.filter((e) => announcement.target === 'all' || e.storeId === announcement.target).length
    showNotice(`Posted to ${targetLabel(announcement.target)} (${count} employees).`)
  }

  return (
    <>
      <section className="page-head">
        <div>
          <h1>{store.name} store</h1>
          <p className="muted">Manager dashboard · {manager.name}</p>
        </div>
        {!showForm && (
          <button className="btn primary" onClick={() => setShowForm(true)}>
            + New announcement
          </button>
        )}
      </section>

      {notice && <div className="notice" role="status">{notice}</div>}

      {showForm && (
        <NewAnnouncementForm manager={manager} onPost={handlePost} onCancel={() => setShowForm(false)} />
      )}

      <h2 className="section-title">
        Announcements ({filtered ? `${visible.length} of ${forMyStore.length}` : forMyStore.length})
      </h2>

      <Filters
        storeName={store.name}
        audience={audienceFilter}
        type={typeFilter}
        typeOptions={[
          ['important', 'Important'],
          ['pending', 'Still waiting on my team'],
          ['info', 'Info only'],
        ]}
        onAudienceChange={setAudienceFilter}
        onTypeChange={setTypeFilter}
      />

      {forMyStore.length === 0 && <p className="empty">No announcements yet.</p>}
      {forMyStore.length > 0 && visible.length === 0 && (
        <p className="empty">No announcements match these filters.</p>
      )}
      {visible.map((a) => (
        <AnnouncementStats
          key={`${manager.id}-${a.id}`}
          announcement={a}
          acks={data.acks[a.id] ?? {}}
          manager={manager}
          onArchive={handleArchive}
        />
      ))}

      {archived.length > 0 && (
        <details className="archive">
          <summary>Archived ({archived.length})</summary>
          <p className="muted small">Hidden from employees. Acknowledgments are kept if you restore a post.</p>
          {archived.map((a) => (
            <ArchivedItem
              key={a.id}
              announcement={a}
              acks={data.acks[a.id] ?? {}}
              manager={manager}
              onRestore={handleRestore}
              onDelete={onDelete}
            />
          ))}
        </details>
      )}
    </>
  )
}

function ArchivedItem({ announcement: a, acks, manager, onRestore, onDelete }) {
  const isAuthor = a.authorId === manager.id
  const audience = EMPLOYEES.filter((e) => a.target === 'all' || e.storeId === a.target)
  const pct = audience.length ? Math.round((audience.filter((e) => acks[e.id]).length / audience.length) * 100) : 0

  function confirmDelete() {
    if (window.confirm(`Permanently delete “${a.title}”? This removes it from the archive and can’t be undone.`)) {
      onDelete(a.id)
    }
  }

  return (
    <article className="card announcement archived">
      <div className="meta">
        {a.important && <span className="badge important">Important</span>}
        <span className="badge">{targetLabel(a.target)}</span>
        <span className="muted">Archived {shortDate(a.archivedAt)}</span>
      </div>
      <h3>{a.title}</h3>
      <p className="byline">
        From {authorLabel(a.authorId)} · posted {shortDate(a.createdAt)}
        {a.important ? ` · ${pct}% acknowledged` : ''}
      </p>
      {isAuthor && (
        <div className="archive-actions">
          <button className="btn small" onClick={() => onRestore(a)}>Restore</button>
          <button className="link danger" onClick={confirmDelete}>Delete permanently</button>
        </div>
      )}
    </article>
  )
}

function NewAnnouncementForm({ manager, onPost, onCancel }) {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState(manager.storeId)
  const [important, setImportant] = useState(false)
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!title.trim() || !message.trim()) {
      setError('Please add a title and a message.')
      return
    }
    onPost({
      id: `a${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      authorId: manager.id,
      target,
      important,
      createdAt: Date.now(),
    })
  }

  return (
    <form className="card form" onSubmit={submit}>
      <h2>New announcement</h2>

      <label className="field">
        <span>Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Schedule change for Saturday"
          maxLength={100}
          autoFocus
        />
      </label>

      <label className="field">
        <span>Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What does your team need to know?"
          rows={5}
        />
      </label>

      <fieldset className="field">
        <legend>Send to</legend>
        <div className="choice-row">
          <label className={`choice ${target === manager.storeId ? 'selected' : ''}`}>
            <input
              type="radio"
              name="target"
              checked={target === manager.storeId}
              onChange={() => setTarget(manager.storeId)}
            />
            My store ({storeById(manager.storeId).name})
          </label>
          <label className={`choice ${target === 'all' ? 'selected' : ''}`}>
            <input type="radio" name="target" checked={target === 'all'} onChange={() => setTarget('all')} />
            All stores
          </label>
        </div>
      </fieldset>

      <label className="toggle">
        <input type="checkbox" checked={important} onChange={(e) => setImportant(e.target.checked)} />
        <span className="switch" aria-hidden="true" />
        <span>
          <strong>Important – requires acknowledgment</strong>
          <small>Pinned to the top of employees’ feeds until they tap “Got it”.</small>
        </span>
      </label>

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn primary">Post announcement</button>
      </div>
    </form>
  )
}

function AnnouncementStats({ announcement: a, acks, manager, onArchive }) {
  // For company-wide posts, managers start by looking at their own team.
  const [scope, setScope] = useState(a.target === 'all' ? manager.storeId : a.target)

  const inScope = (e) => (scope === 'all' ? a.target === 'all' || e.storeId === a.target : e.storeId === scope)
  const audience = EMPLOYEES.filter(inScope)
  const acked = audience.filter((e) => acks[e.id])
  const pending = audience.filter((e) => !acks[e.id])
  const pct = audience.length ? Math.round((acked.length / audience.length) * 100) : 0

  return (
    <article className={`card announcement ${a.important ? 'is-important' : ''}`}>
      <div className="meta">
        {a.important && <span className="badge important">Important</span>}
        <span className="badge">{targetLabel(a.target)}</span>
        <span className="muted">{timeAgo(a.createdAt)}</span>
      </div>
      <h3>{a.title}</h3>
      <p className="byline">From {authorLabel(a.authorId)}</p>
      <details className="message-toggle">
        <summary>Show message</summary>
        <p className="message">{a.message}</p>
      </details>

      {a.important ? (
        <div className="stats">
          {a.target === 'all' && (
            <label className="scope">
              <span>Showing</span>
              <select value={scope} onChange={(e) => setScope(e.target.value)}>
                <option value="all">All stores</option>
                {STORES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}{s.id === manager.storeId ? ' (my store)' : ''}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="stat-line">
            <span className="pct">{pct}%</span>
            <span className="muted">
              acknowledged · {acked.length} of {audience.length}
            </span>
          </div>
          <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div style={{ width: `${pct}%` }} className={pct === 100 ? 'done' : ''} />
          </div>

          {a.target === 'all' && scope === 'all' && <StoreBreakdown acks={acks} />}

          {pending.length === 0 ? (
            <p className="all-done">✓ Everyone has acknowledged this.</p>
          ) : (
            <details className="pending">
              <summary>Not yet acknowledged ({pending.length})</summary>
              <ul className="people">
                {pending.map((e) => (
                  <li key={e.id}>
                    <span>{e.name}</span>
                    <span className="muted">
                      {e.title}
                      {scope === 'all' ? ` · ${storeById(e.storeId).name}` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          )}
          {acked.length > 0 && (
            <details className="pending">
              <summary>Acknowledged ({acked.length})</summary>
              <ul className="people">
                {[...acked]
                  .sort((x, y) => acks[y.id] - acks[x.id])
                  .map((e) => (
                    <li key={e.id}>
                      <span>{e.name}</span>
                      <span className="muted">
                        {e.title}
                        {scope === 'all' ? ` · ${storeById(e.storeId).name}` : ''} · {shortDate(acks[e.id])}
                      </span>
                    </li>
                  ))}
              </ul>
            </details>
          )}
        </div>
      ) : (
        <p className="info-only">Info only · no acknowledgment needed</p>
      )}

      {a.authorId === manager.id && (
        <button className="link archive-link" onClick={() => onArchive(a)}>Archive announcement</button>
      )}
    </article>
  )
}

function StoreBreakdown({ acks }) {
  return (
    <ul className="breakdown">
      {STORES.map((s) => {
        const staff = EMPLOYEES.filter((e) => e.storeId === s.id)
        const pct = Math.round((staff.filter((e) => acks[e.id]).length / staff.length) * 100)
        return (
          <li key={s.id}>
            <span className="store-name">{s.name}</span>
            <span className="mini-bar"><span style={{ width: `${pct}%` }} /></span>
            <span className="mini-pct">{pct}%</span>
          </li>
        )
      })}
    </ul>
  )
}

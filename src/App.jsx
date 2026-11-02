import { useStoredState } from './storage'
import { buildSeedData, DEMO_EMPLOYEE_ID, MANAGERS, STORES, EMPLOYEES, personById, storeById } from './data'
import ManagerView from './ManagerView'
import EmployeeView from './EmployeeView'

export default function App() {
  const [data, setData] = useStoredState('summit.data.v1', () => buildSeedData())
  const [role, setRole] = useStoredState('summit.role', 'manager')
  const [managerId, setManagerId] = useStoredState('summit.managerId', MANAGERS[0].id)
  const [employeeId, setEmployeeId] = useStoredState('summit.employeeId', DEMO_EMPLOYEE_ID)

  const manager = personById(managerId) ?? MANAGERS[0]
  const employee = personById(employeeId) ?? EMPLOYEES[0]

  function postAnnouncement(announcement) {
    setData((d) => ({
      announcements: [announcement, ...d.announcements],
      acks: announcement.important ? { ...d.acks, [announcement.id]: {} } : d.acks,
    }))
  }

  // Archiving hides a post from employees but keeps it (and its acknowledgments) so it can be restored.
  function setArchived(id, archived) {
    setData((d) => ({
      ...d,
      announcements: d.announcements.map((a) =>
        a.id === id ? { ...a, archivedAt: archived ? Date.now() : null } : a,
      ),
    }))
  }

  function deleteAnnouncement(id) {
    setData((d) => {
      const { [id]: _removed, ...acks } = d.acks
      return { announcements: d.announcements.filter((a) => a.id !== id), acks }
    })
  }

  function acknowledge(announcementId, personId) {
    setData((d) => ({
      ...d,
      acks: { ...d.acks, [announcementId]: { ...d.acks[announcementId], [personId]: Date.now() } },
    }))
  }

  function resetDemo() {
    if (window.confirm('Reset all announcements and acknowledgments back to the sample data?')) {
      setData(buildSeedData())
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="logo" aria-hidden="true">▲</div>
          <div>
            <div className="brand-name">Summit Retail Group</div>
            <div className="brand-sub">Team Updates</div>
          </div>
        </div>

        <div className="viewer">
          <div className="segmented" role="tablist" aria-label="View as role">
            {['manager', 'employee'].map((r) => (
              <button
                key={r}
                role="tab"
                aria-selected={role === r}
                className={role === r ? 'active' : ''}
                onClick={() => setRole(r)}
              >
                {r === 'manager' ? 'Manager' : 'Employee'}
              </button>
            ))}
          </div>

          <label className="viewer-select">
            <span>Viewing as</span>
            {role === 'manager' ? (
              <select value={manager.id} onChange={(e) => setManagerId(e.target.value)}>
                {MANAGERS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {storeById(m.storeId).name}
                  </option>
                ))}
              </select>
            ) : (
              <select value={employee.id} onChange={(e) => setEmployeeId(e.target.value)}>
                {STORES.map((s) => (
                  <optgroup key={s.id} label={s.name}>
                    {EMPLOYEES.filter((e) => e.storeId === s.id).map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.title})
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            )}
          </label>
        </div>
      </header>

      <main className="content">
        {role === 'manager' ? (
          <ManagerView
            manager={manager}
            data={data}
            onPost={postAnnouncement}
            onArchive={(id) => setArchived(id, true)}
            onRestore={(id) => setArchived(id, false)}
            onDelete={deleteAnnouncement}
          />
        ) : (
          <EmployeeView employee={employee} data={data} onAcknowledge={acknowledge} />
        )}
      </main>

      <footer className="footer">
        Demo app · changes are saved in this browser only ·{' '}
        <button className="link" onClick={resetDemo}>Reset sample data</button>
      </footer>
    </div>
  )
}

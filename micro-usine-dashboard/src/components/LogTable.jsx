import { useState } from 'react'
import Pagination from './Pagination'

const ITEMS_PER_PAGE = 10

const getBadge = (action) => {
  if (action === 'swipe_up' || action === 'scroll_up') return { label: 'Swipe Up', className: 'badge-up' }
  if (action === 'swipe_down' || action === 'scroll_down') return { label: 'Swipe Down', className: 'badge-down' }
  if (action.startsWith('session_start')) return { label: 'Session Start', className: 'badge-up' }
  if (action.startsWith('session_stop')) return { label: 'Session Stop', className: 'badge-down' }
  return { label: action, className: 'badge-down' }
}

function LogTable({ logs }) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE)

  const paginated = logs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <div className="card">
      <h3>Historique des actions</h3>
      <div style={{ overflowY: 'auto', maxHeight: '320px' }}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Action</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(log => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>
                  <span className={getBadge(log.action).className}>
                    {getBadge(log.action).label}
                  </span>
                </td>
                <td>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}

export default LogTable
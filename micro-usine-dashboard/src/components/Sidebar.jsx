import { useNavigate, useLocation } from 'react-router-dom'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { path: '/supervision', label: 'Supervision' },
    { path: '/control', label: 'Control' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/logs', label: 'Logs' },
  ]

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="sidebar">
      <h2>Micro-Usine</h2>
      {links.map(link => (
        <button
          key={link.path}
          onClick={() => navigate(link.path)}
          style={{
            backgroundColor: location.pathname === link.path ? '#e94560' : 'transparent'
          }}
        >
          {link.label}
        </button>
      ))}
      <div style={{ marginTop: 'auto' }}>
        <button onClick={logout}>Deconnexion</button>
      </div>
    </div>
  )
}

export default Sidebar
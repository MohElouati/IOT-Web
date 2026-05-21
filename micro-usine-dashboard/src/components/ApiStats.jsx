import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const API = 'http://localhost:3000'

function ApiStats({ period = '24h' }) {
  const [stats, setStats] = useState(null)

  const fetchStats = async () => {
    const res = await axios.get(`${API}/api-stats?period=${period}`)
    setStats(res.data)
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [period])

  if (!stats) return <div style={{ color: '#888' }}>Chargement...</div>

  const chartData = stats.by_route.map(r => ({
    name: r.route,
    appels: r.count,
    temps: Math.round(r.avg_time)
  }))

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: '16px', marginBottom: '16px' }}>
        <div className="stat-card">
          <div className="value">{stats.total}</div>
          <div className="label">Total requêtes</div>
        </div>
        <div className="stat-card">
          <div className="value" style={{ fontSize: '16px' }}>{stats.last_request ? stats.last_request.route : '--'}</div>
          <div className="label">Dernière requête</div>
        </div>
        <div className="stat-card">
          <div className="value" style={{ fontSize: '16px' }}>{stats.last_request ? stats.last_request.timestamp : '--'}</div>
          <div className="label">Timestamp</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '16px' }}>
        <h3>Appels par route</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 11 }} />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none' }} />
            <Bar dataKey="appels" fill="#e94560" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h3>Temps de réponse moyen (ms)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#888" tick={{ fontSize: 11 }} />
            <YAxis stroke="#888" />
            <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none' }} />
            <Bar dataKey="temps" fill="#2ecc71" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ApiStats
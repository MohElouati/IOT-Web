import { useState, useEffect } from 'react'
import api from '../api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import ScrollControl from '../components/ScrollControl'
import LogTable from '../components/LogTable'
import '../styles/dashboard.css'

function Dashboard() {
  const [logs, setLogs] = useState([])
  const [status, setStatus] = useState(null)

  const fetchLogs = async () => {
    const res = await api.get(`/logs`)
    setLogs(res.data)
  }

  const fetchStatus = async () => {
    const res = await api.get(`/status`)
    setStatus(res.data)
  }

  useEffect(() => {
    fetchLogs()
    fetchStatus()
    const interval = setInterval(() => {
      fetchLogs()
      fetchStatus()
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const scrollUp = logs.filter(l => l.action === 'scroll_up').length
  const scrollDown = logs.filter(l => l.action === 'scroll_down').length
  const total = logs.length

  const chartData = [
    { name: 'Scroll Up', value: scrollUp },
    { name: 'Scroll Down', value: scrollDown },
  ]

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <h1>Dashboard Supervision</h1>
          <div>
            <span className="status-dot" />
            <span style={{ color: '#888', fontSize: '14px' }}>
              {status ? `Broker : ${status.broker}` : 'Chargement...'}
            </span>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard value={total} label="Total actions" trend="up" />
          <StatCard value={scrollUp} label="Scroll Up" trend="up" />
          <StatCard value={scrollDown} label="Scroll Down" trend="down" />
          <StatCard value={status ? 'Online' : 'Offline'} label="Système" />
        </div>

        <div className="content-grid">
          <div>
            <ScrollControl onScroll={fetchLogs} />
            <div className="card" style={{ marginTop: '16px' }}>
              <h3>Activité</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#222', border: 'none' }}
                  />
                  <Bar dataKey="value" fill="#e94560" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <LogTable logs={logs} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
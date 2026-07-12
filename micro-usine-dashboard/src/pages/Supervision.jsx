import { useState, useEffect } from 'react'
import api from '../api'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import TabNav from '../components/TabNav'
import TimeFilter from '../components/TimeFilter'
import StatusTable from '../components/StatusTable'
import '../styles/dashboard.css'
import ApiStats from '../components/ApiStats'

function Supervision() {
  const [logs, setLogs] = useState([])
  const [status, setStatus] = useState(null)
  const [broker, setBroker] = useState(null)
  const [activeTab, setActiveTab] = useState('global')
  const [period, setPeriod] = useState('24h')

  const fetchData = async () => {
    const [logsRes, statusRes, brokerRes] = await Promise.all([
      api.get(`/logs?period=${period}`),
      api.get(`/system-health/connectivity`),
      api.get(`/system-health/broker`),
    ])
    setLogs(logsRes.data)
    setStatus(statusRes.data)
    setBroker(brokerRes.data)
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [period])

  const formatUptime = (raw) => {
    const seconds = parseInt(raw)
    if (isNaN(seconds)) return raw
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h}h ${m}m ${s}s`
  }

  const chartData = logs.reduce((acc, log) => {
    const hour = log.timestamp.substring(11, 16)
    const existing = acc.find(d => d.time === hour)
    if (existing) {
      existing.total += 1
    } else {
      acc.push({ time: hour, total: 1 })
    }
    return acc
  }, []).reverse()

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <h1>Supervision</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <TimeFilter onChange={(range) => setPeriod(range)} />
            <div>
              <span className="status-dot" />
              <span style={{ color: '#888', fontSize: '14px' }}>
                {status ? `Broker : ${status.broker}` : 'Chargement...'}
              </span>
            </div>
          </div>
        </div>

        <TabNav activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'global' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <StatCard value={logs.length} label="Total Swipes" trend="up" />
              <StatusTable
                broker={status ? true : false}
                esp32={status ? status.esp32 : false}
              />
            </div>
            <div className="card">
              <h3>Scrolls dans le temps</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip contentStyle={{ backgroundColor: '#222', border: 'none' }} />
                  <Line type="monotone" dataKey="total" stroke="#e94560" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {activeTab === 'systems' && (
          <div className="stats-grid">
            <StatCard value={broker ? broker.clients_connected : '--'} label="Clients connectés" trend="up" />
            <StatCard value={broker ? formatUptime(broker.uptime) : '--'} label="Uptime Broker" />
            <StatCard value={broker ? broker.messages_received : '--'} label="Messages reçus" trend="up" />
          </div>
        )}

        {activeTab === 'api' && <ApiStats period={period} />}

        {activeTab === 'bras' && (
          <div className="card">
            <h3>Bras robot</h3>
            <p style={{ color: '#888', marginTop: '8px', fontSize: '14px' }}>
              Les données du bras seront disponibles une fois le matériel assemblé.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Supervision
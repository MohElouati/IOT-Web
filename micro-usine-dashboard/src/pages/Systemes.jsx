import { useState, useEffect } from 'react'
import api from '../api'
import Sidebar from '../components/Sidebar'
import StatCard from '../components/StatCard'
import '../styles/dashboard.css'

function Systemes() {
  const [broker, setBroker] = useState(null)

  const fetchData = async () => {
    const res = await api.get(`/system-health/broker`)
    setBroker(res.data)
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <h1>Systemes</h1>
        </div>

        <div className="stats-grid">
          <StatCard
            value={broker ? broker.clients_connected : '--'}
            label="Clients connectés"
            trend="up"
          />
          <StatCard
            value={broker ? broker.uptime : '--'}
            label="Uptime Broker"
          />
          <StatCard
            value={broker ? broker.messages_received : '--'}
            label="Messages reçus"
            trend="up"
          />
        </div>
      </div>
    </div>
  )
}

export default Systemes
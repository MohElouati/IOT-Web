import { useState, useEffect } from 'react'
import api from '../api'
import Sidebar from '../components/Sidebar'
import LogTable from '../components/LogTable'
import '../styles/dashboard.css'

function Logs() {
  const [logs, setLogs] = useState([])

  const fetchLogs = async () => {
    const res = await api.get(`/logs`)
    setLogs(res.data)
  }

  useEffect(() => {
    fetchLogs()
    const interval = setInterval(fetchLogs, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <h1>Logs</h1>
        </div>
        <LogTable logs={logs} />
      </div>
    </div>
  )
}

export default Logs